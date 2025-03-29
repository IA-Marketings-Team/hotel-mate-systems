
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, RegisterType } from "@/types";

interface TransactionFilters {
  registerType?: RegisterType;
  clientId?: string;
}

interface CreateTransactionPayload {
  description: string;
  amount: number;
  type: 'payment' | 'refund' | 'pending';
  method: 'cash' | 'card' | 'transfer';
  registerType: RegisterType;
  category?: string;
  subcategory?: string;
  clientId?: string;
  staffId?: string;
}

export const useTransactions = (filters?: RegisterType | TransactionFilters) => {
  // Convert string filter to object filter for backward compatibility
  const normalizedFilters: TransactionFilters = typeof filters === 'string' 
    ? { registerType: filters } 
    : filters || {};
  
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['transactions', normalizedFilters],
    queryFn: async () => {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          staff:staff_id(name),
          client:client_id(name)
        `)
        .order('date', { ascending: false });
      
      if (normalizedFilters.registerType) {
        query = query.eq('register_type', normalizedFilters.registerType);
      }
      
      if (normalizedFilters.clientId) {
        query = query.eq('client_id', normalizedFilters.clientId);
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
        type: item.type as 'payment' | 'refund' | 'pending',
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

  const createTransaction = useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      // S'assurer que payload.clientId et payload.staffId ne sont pas vides
      const clientId = payload.clientId === "none" ? null : payload.clientId;
      const staffId = payload.staffId === "none" ? null : payload.staffId;
      
      console.log("Creating transaction with data:", {
        ...payload,
        client_id: clientId,
        staff_id: staffId
      });
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          description: payload.description,
          amount: payload.amount,
          type: payload.type,
          method: payload.method,
          register_type: payload.registerType,
          category: payload.category,
          subcategory: payload.subcategory,
          client_id: clientId,
          staff_id: staffId,
          date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        throw new Error(`Error creating transaction: ${error.message}`);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return {
    ...query,
    createTransaction
  };
};
