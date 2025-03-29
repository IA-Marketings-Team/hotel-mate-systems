
import { RegisterType } from "./index";

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

export interface CreateInvoiceData {
  description: string;
  amount: number;
  clientId: string | null;
  staffId: string | null;
  category?: string;
  subcategory?: string;
  registerType: RegisterType;
  dueDate?: string;
}

export interface InvoiceFilters {
  clientId?: string;
  status?: string;
}
