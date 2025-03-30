
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateInvoiceData } from "@/types/invoice";
import { RegisterType } from "@/types";

export const useInvoiceCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceData: CreateInvoiceData) => {
      // The transactions table has a check constraint for the type column
      // Valid types are: 'payment', 'refund', 'pending', 'partial'
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: invoiceData.description,
          amount: invoiceData.amount,
          type: 'partial', // Using 'partial' instead of 'pending' to indicate unpaid invoice
          method: invoiceData.method || 'card', // Default method, can be updated when payment is processed
          register_type: invoiceData.registerType as RegisterType,
          category: invoiceData.category || null,
          subcategory: invoiceData.subcategory || null,
          client_id: invoiceData.clientId,
          staff_id: invoiceData.staffId,
          date: new Date().toISOString(),
          due_date: invoiceData.dueDate || null,
          paid_amount: 0, // Initialize with 0 since it's unpaid
          remaining_amount: invoiceData.amount // Set to full amount since nothing is paid yet
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error creating invoice: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success("La facture a été créée avec succès");
    }
  });
};
