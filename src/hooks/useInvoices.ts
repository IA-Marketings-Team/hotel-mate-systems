
import { useInvoiceList } from "./invoice/useInvoiceList";
import { useInvoiceCreate } from "./invoice/useInvoiceCreate";
import { useInvoiceActions } from "./invoice/useInvoiceActions";
import { InvoiceFilters } from "@/types/invoice";

// Re-export the Invoice type
export { Invoice } from "@/types/invoice";

export const useInvoices = (filters?: InvoiceFilters) => {
  const invoiceList = useInvoiceList(filters);
  const { generateAndDownloadInvoice, markAsPaid, cancelInvoice } = useInvoiceActions();
  const createInvoice = useInvoiceCreate();

  return {
    ...invoiceList,
    createInvoice,
    generateAndDownloadInvoice,
    markAsPaid,
    cancelInvoice
  };
};
