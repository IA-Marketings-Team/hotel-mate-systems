
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreateInvoiceData } from "@/types/invoice";
import { RegisterType } from "@/types";

export const useInvoiceCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceData: CreateInvoiceData) => {
      // Update to always create invoices with 'payment' status instead of 'pending'
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: invoiceData.description,
          amount: invoiceData.amount,
          type: 'payment', // Changed from 'pending' to 'payment'
          method: 'card', // Default method, can be updated when payment is processed
          register_type: invoiceData.registerType as RegisterType,
          category: invoiceData.category || null,
          subcategory: invoiceData.subcategory || null,
          client_id: invoiceData.clientId,
          staff_id: invoiceData.staffId,
          date: new Date().toISOString(),
          due_date: invoiceData.dueDate || null,
          paid_amount: invoiceData.amount, // Initialize with full amount since it's a payment
          remaining_amount: 0 // Set to 0 since it's fully paid
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
