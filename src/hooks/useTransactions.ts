
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
      
      return data as Transaction[];
    }
  });
};
