
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "@/lib/pdfUtils";
import { toast } from "sonner";
import { Invoice } from "@/types/invoice";
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
        type: data.type as 'payment' | 'refund' | 'pending',
        method: data.method as 'cash' | 'card' | 'transfer',
        registerType: data.register_type as RegisterType,
        description: data.description,
        staffId: data.staff_id,
        staffName: data.staff?.name,
        clientId: data.client_id,
        clientName: data.client?.name,
        category: data.category,
        subcategory: data.subcategory
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

  const markAsPaid = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from('transactions')
        .update({ type: 'payment' as "payment" | "refund" | "pending" })
        .eq('id', invoiceId);
      
      if (error) {
        throw new Error(`Error updating invoice: ${error.message}`);
      }
      
      return true;
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
        .update({ type: 'refund' as "payment" | "refund" | "pending" })
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
    markAsPaid,
    cancelInvoice
  };
};
