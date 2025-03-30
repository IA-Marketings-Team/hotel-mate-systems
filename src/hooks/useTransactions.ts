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
  type: 'payment' | 'refund' | 'pending' | 'partial';
  method: 'cash' | 'card' | 'transfer';
  registerType: RegisterType;
  category?: string;
  subcategory?: string;
  clientId?: string;
  staffId?: string;
}

export const useTransactions = (filters?: RegisterType | TransactionFilters) => {
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
      
      return (data || []).map(item => ({
        id: item.id,
        date: item.date,
        amount: item.amount,
        type: item.type as 'payment' | 'refund' | 'pending' | 'partial',
        method: item.method as 'cash' | 'card' | 'transfer',
        registerType: item.register_type as RegisterType,
        description: item.description,
        staffId: item.staff_id,
        staffName: item.staff?.name,
        clientId: item.client_id,
        clientName: item.client?.name,
        category: item.category,
        subcategory: item.subcategory,
        paidAmount: item.paid_amount || 0,
        remainingAmount: item.remaining_amount || 0,
        dueDate: item.due_date,
        lastPaymentDate: item.last_payment_date
      })) as Transaction[];
    }
  });

  const createTransaction = useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
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
          date: new Date().toISOString(),
          paid_amount: payload.type === 'payment' ? payload.amount : 0,
          remaining_amount: payload.type === 'payment' ? 0 : payload.amount,
          last_payment_date: payload.type === 'payment' ? new Date().toISOString() : null
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating transaction:", error.message);
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
}
