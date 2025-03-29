
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";

export const useTransactionDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      if (!id) throw new Error("Transaction ID is required");
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching transaction: ${error.message}`);
      }
      
      return {
        id: data.id,
        date: data.date,
        amount: data.amount,
        type: data.type as 'payment' | 'refund',
        method: data.method as 'cash' | 'card' | 'transfer',
        registerType: data.register_type as 'hotel' | 'restaurant' | 'poker' | 'rooftop',
        description: data.description,
        staffId: data.staff_id,
        clientId: data.client_id,
        category: data.category,
        subcategory: data.subcategory
      } as Transaction;
    },
    enabled: !!id
  });
};
