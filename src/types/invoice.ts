
import { RegisterType } from "./index";

export interface Invoice {
  id: string;
  transactionId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  status: "paid" | "pending" | "overdue" | "cancelled" | "partially_paid";
  clientId: string | null;
  clientName: string | null;
  amount: number;
  paidAmount?: number; // Amount already paid
  remainingAmount?: number; // Amount still to be paid
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

export interface InvoicePaymentData {
  invoiceId: string;
  amount: number;
  method: "cash" | "card" | "transfer";
}
