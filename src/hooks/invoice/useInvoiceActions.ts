
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "@/lib/pdfUtils";
import { toast } from "sonner";
import { Invoice, InvoicePaymentData } from "@/types/invoice";
import { Transaction, RegisterType } from "@/types";

export const useInvoiceActions = () => {
  const queryClient = useQueryClient();

  const generateAndDownloadInvoice = async (invoice: Invoice) => {
    try {
      // First get the full transaction data
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          staff:staff_id(name),
          client:client_id(name)
        `)
        .eq('id', invoice.transactionId)
        .single();
      
      if (error) {
        throw new Error(`Error fetching transaction: ${error.message}`);
      }
      
      const transaction: Transaction = {
        id: data.id,
        date: data.date,
        amount: data.amount,
        type: data.type as 'payment' | 'refund' | 'pending' | 'partial',
        method: data.method as 'cash' | 'card' | 'transfer',
        registerType: data.register_type as RegisterType,
        description: data.description,
        staffId: data.staff_id,
        staffName: data.staff?.name,
        clientId: data.client_id,
        clientName: data.client?.name,
        category: data.category,
        subcategory: data.subcategory,
        paidAmount: data.paid_amount,
        remainingAmount: data.remaining_amount,
        dueDate: data.due_date,
        lastPaymentDate: data.last_payment_date
      };

      const filename = generateInvoicePDF(transaction);
      toast.success("La facture a été générée avec succès");
      return filename;
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Impossible de générer la facture");
      throw error;
    }
  };

  const processPayment = useMutation({
    mutationFn: async (paymentData: InvoicePaymentData) => {
      // First get the current invoice data
      const { data: invoice, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', paymentData.invoiceId)
        .single();

      if (fetchError) {
        throw new Error(`Error fetching invoice: ${fetchError.message}`);
      }

      // Calculate paid and remaining amounts
      const currentPaidAmount = invoice.paid_amount || 0;
      const newPaidAmount = currentPaidAmount + paymentData.amount;
      const newRemainingAmount = invoice.amount - newPaidAmount;
      
      // Determine invoice status based on payment
      let newType = invoice.type;
      
      if (newPaidAmount >= invoice.amount) {
        // Fully paid
        newType = 'payment';
      } else if (newPaidAmount > 0 && newPaidAmount < invoice.amount) {
        // Partially paid
        newType = 'partial';
      }
      
      console.log(`Updating invoice payment: Amount=${paymentData.amount}, NewPaidAmount=${newPaidAmount}, NewType=${newType}`);
      
      // Update the invoice
      const { error } = await supabase
        .from('transactions')
        .update({
          type: newType,
          method: paymentData.method,
          paid_amount: newPaidAmount,
          remaining_amount: newRemainingAmount,
          last_payment_date: new Date().toISOString()
        })
        .eq('id', paymentData.invoiceId);
      
      if (error) {
        throw new Error(`Error updating invoice: ${error.message}`);
      }
      
      return {
        invoiceId: paymentData.invoiceId,
        paidAmount: newPaidAmount,
        remainingAmount: newRemainingAmount,
        status: newType
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const cancelInvoice = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from('transactions')
        .update({ type: 'refund' })
        .eq('id', invoiceId);
      
      if (error) {
        throw new Error(`Error canceling invoice: ${error.message}`);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return {
    generateAndDownloadInvoice,
    processPayment,
    cancelInvoice
  };
};
