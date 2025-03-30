
import { useState } from "react";
import { RegisterType } from "@/types";

export interface TransactionFormData {
  type: "payment" | "refund" | "pending" | "partial";
  method: "cash" | "card" | "transfer";
  description: string;
  amount: string;
  category: string | null;
  subcategory: string | null;
  clientId: string;
  staffId: string;
}

interface UseTransactionFormProps {
  initialType?: "payment" | "refund" | "pending" | "partial";
  initialDescription?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialSubcategory?: string;
  initialClientId?: string;
}

export function useTransactionForm({
  initialType = "payment",
  initialDescription = "",
  initialAmount,
  initialCategory = null,
  initialSubcategory = null,
  initialClientId = "none",
}: UseTransactionFormProps = {}) {
  const [type, setType] = useState<"payment" | "refund" | "pending" | "partial">(initialType);
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("card");
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory);
  const [clientId, setClientId] = useState(initialClientId || "none");
  const [staffId, setStaffId] = useState("none");

  const getFormData = (): TransactionFormData => ({
    type,
    method,
    description,
    amount,
    category: selectedCategory,
    subcategory: selectedSubcategory,
    clientId,
    staffId
  });

  return {
    // Form state
    type,
    method,
    description,
    amount,
    selectedCategory,
    selectedSubcategory,
    clientId,
    staffId,
    
    // Updater functions
    setType,
    setMethod,
    setDescription,
    setAmount,
    setSelectedCategory,
    setSelectedSubcategory,
    setClientId,
    setStaffId,
    
    // Helper methods
    getFormData
  };
}
