
import { useInvoiceList } from "./invoice/useInvoiceList";
import { useInvoiceCreate } from "./invoice/useInvoiceCreate";
import { useInvoiceActions } from "./invoice/useInvoiceActions";
import { InvoiceFilters } from "@/types/invoice";

// Re-export the Invoice type using export type
export type { Invoice } from "@/types/invoice";

export const useInvoices = (filters?: InvoiceFilters) => {
  const invoiceList = useInvoiceList(filters);
  const { generateAndDownloadInvoice, processPayment, cancelInvoice } = useInvoiceActions();
  const createInvoice = useInvoiceCreate();

  return {
    ...invoiceList,
    createInvoice,
    generateAndDownloadInvoice,
    processPayment,
    cancelInvoice
  };
};
