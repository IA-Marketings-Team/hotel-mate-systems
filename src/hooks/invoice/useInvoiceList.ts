
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
        } else if (filters.status === 'partially_paid') {
          query = query.eq('type', 'partial');
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
        dueDate: (item.type === 'pending' || item.type === 'partial') ? item.due_date || new Date(new Date(item.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        status: mapTransactionTypeToInvoiceStatus(item.type, item.paid_amount, item.amount),
        clientId: item.client_id,
        clientName: item.client?.name,
        amount: item.amount,
        paidAmount: item.paid_amount || 0,
        remainingAmount: item.remaining_amount || (item.type !== 'payment' ? item.amount - (item.paid_amount || 0) : 0),
        pdfUrl: null
      })) as Invoice[];
    }
  });
};

function mapTransactionTypeToInvoiceStatus(
  type: string, 
  paidAmount: number | null | undefined, 
  totalAmount: number
): "paid" | "pending" | "overdue" | "cancelled" | "partially_paid" {
  switch (type) {
    case 'payment':
      return 'paid';
    case 'pending':
      return 'pending';
    case 'partial':
      return 'partially_paid';
    case 'refund':
      return 'cancelled';
    default:
      // Check if it's partially paid
      if (paidAmount && paidAmount > 0 && paidAmount < totalAmount) {
        return 'partially_paid';
      }
      return 'pending';
  }
}
