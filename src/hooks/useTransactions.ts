
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, RegisterType } from "@/types";

export const useTransactions = (registerType?: RegisterType) => {
  return useQuery({
    queryKey: ['transactions', registerType],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          staff:staff_id(name),
          client:client_id(name)
        `)
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
        registerType: item.register_type as RegisterType,
        description: item.description,
        staffId: item.staff_id,
        staffName: item.staff?.name,
        clientId: item.client_id,
        clientName: item.client?.name,
        category: item.category,
        subcategory: item.subcategory
      })) as Transaction[];
    }
  });
};
