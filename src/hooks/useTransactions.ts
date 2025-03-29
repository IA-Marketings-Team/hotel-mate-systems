
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";

export const useTransactions = (registerType?: string) => {
  return useQuery({
    queryKey: ['transactions', registerType],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (registerType) {
        query = query.eq('register_type', registerType);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
      }
      
      // Transform the data to match the Transaction type
      return (data || []).map(item => ({
        id: item.id,
        date: item.date,
        amount: item.amount,
        type: item.type as 'payment' | 'refund',
        method: item.method as 'cash' | 'card' | 'transfer',
        registerType: item.register_type as any, // This maps register_type to registerType
        description: item.description,
        staffId: item.staff_id,
        clientId: item.client_id,
        category: item.category,
        subcategory: item.subcategory
      })) as Transaction[];
    }
  });
};
