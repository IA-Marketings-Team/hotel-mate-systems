
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, RegisterType } from "@/types";
import { generateInvoicePDF } from "@/lib/pdfUtils";
import { toast } from "sonner";

export interface Invoice {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  status: "paid" | "pending" | "overdue" | "cancelled";
  clientId: string | null;
  clientName: string | null;
  amount: number;
  pdfUrl: string | null;
}

export const useInvoices = (filters?: { clientId?: string; status?: string }) => {
  const queryClient = useQueryClient();

  const fetchInvoices = async () => {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        client:client_id(name)
      `)
      .order('date', { ascending: false });
    
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }
    
    if (filters?.status) {
      if (filters.status === 'pending') {
        query = query.eq('type', 'pending');
      } else if (filters.status === 'paid') {
        query = query.eq('type', 'payment');
      }
    }

    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Error fetching invoices: ${error.message}`);
    }
    
    // Transform transactions to invoices
    return (data || []).map((item, index) => ({
      id: item.id,
      transactionId: item.id,
      invoiceNumber: `INV-${new Date(item.date).getFullYear()}-${(index + 1).toString().padStart(4, '0')}`,
      date: item.date,
      dueDate: item.type === 'pending' ? new Date(new Date(item.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      status: item.type === 'payment' ? 'paid' : item.type === 'pending' ? 'pending' : 'cancelled',
      clientId: item.client_id,
      clientName: item.client?.name,
      amount: item.amount,
      pdfUrl: null
    })) as Invoice[];
  };

  const query = useQuery({
    queryKey: ['invoices', filters],
    queryFn: fetchInvoices
  });

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
        .update({ type: 'payment' })
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
        .update({ type: 'refund' })
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
    ...query,
    generateAndDownloadInvoice,
    markAsPaid,
    cancelInvoice
  };
};
