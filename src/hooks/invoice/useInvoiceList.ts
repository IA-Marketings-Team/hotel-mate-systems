
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceFilters } from "@/types/invoice";

export const useInvoiceList = (filters?: InvoiceFilters) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
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
    }
  });
};
