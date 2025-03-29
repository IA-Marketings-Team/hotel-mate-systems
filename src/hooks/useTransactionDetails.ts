
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";

export const useTransactionDetails = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      if (!id) throw new Error("Transaction ID is required");
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          staff:staff_id(name),
          client:client_id(name)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching transaction: ${error.message}`);
      }
      
      return {
        id: data.id,
        date: data.date,
        amount: data.amount,
        type: data.type as 'payment' | 'refund' | 'pending' | 'partial',
        method: data.method as 'cash' | 'card' | 'transfer',
        registerType: data.register_type as 'hotel' | 'restaurant' | 'poker' | 'rooftop',
        description: data.description,
        staffId: data.staff_id,
        staffName: data.staff?.name,
        clientId: data.client_id,
        clientName: data.client?.name,
        category: data.category,
        subcategory: data.subcategory,
        paidAmount: data.paid_amount || 0,
        remainingAmount: data.remaining_amount || 0,
        dueDate: data.due_date,
        lastPaymentDate: data.last_payment_date
      } as Transaction;
    },
    enabled: !!id
  });

  const updateTransaction = useMutation({
    mutationFn: async (updatedTransaction: Partial<Transaction>) => {
      if (!id) throw new Error("Transaction ID is required");
      
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: updatedTransaction.amount,
          type: updatedTransaction.type,
          method: updatedTransaction.method,
          description: updatedTransaction.description,
          category: updatedTransaction.category,
          subcategory: updatedTransaction.subcategory,
          client_id: updatedTransaction.clientId,
          staff_id: updatedTransaction.staffId,
          // Update paid_amount and remaining_amount based on the transaction type
          paid_amount: updatedTransaction.type === 'payment' ? updatedTransaction.amount : 0,
          remaining_amount: updatedTransaction.type === 'payment' ? 0 : updatedTransaction.amount,
          last_payment_date: updatedTransaction.type === 'payment' ? new Date().toISOString() : null
        })
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error updating transaction: ${error.message}`);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaction', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const deleteTransaction = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Transaction ID is required");
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Error deleting transaction: ${error.message}`);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return {
    ...query,
    updateTransaction,
    deleteTransaction
  };
};
