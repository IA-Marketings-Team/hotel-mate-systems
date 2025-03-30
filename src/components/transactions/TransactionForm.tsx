
import React, { useState } from "react";
import { RegisterType } from "@/types";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionMethodSelector } from "./TransactionMethodSelector";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { DescriptionField } from "./form-fields/DescriptionField";
import { AmountField } from "./form-fields/AmountField";
import { ClientField } from "./form-fields/ClientField";
import { StaffField } from "./form-fields/StaffField";
import { FormActions } from "./form-fields/FormActions";

export interface TransactionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  registerType: RegisterType;
  clientId?: string;
  initialDescription?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialSubcategory?: string;
  initialType?: "payment" | "refund" | "pending" | "partial";
  disablePendingType?: boolean;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  isSubmitting,
  registerType,
  clientId: initialClientId,
  initialDescription = "",
  initialAmount,
  initialCategory,
  initialSubcategory,
  initialType = "payment",
  disablePendingType = false,
}: TransactionFormProps) {
  const [type, setType] = useState<"payment" | "refund" | "pending" | "partial">(initialType);
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("card");
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory || null);
  const [clientId, setClientId] = useState(initialClientId || "none");
  const [staffId, setStaffId] = useState("none");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", {
      description,
      amount,
      type,
      method,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      clientId: clientId,
      staffId: staffId,
    });
    
    onSubmit({
      description,
      amount,
      type,
      method,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      clientId: clientId === "none" ? null : clientId,
      staffId: staffId === "none" ? null : staffId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DescriptionField 
        description={description}
        setDescription={setDescription}
      />

      <AmountField
        amount={amount}
        setAmount={setAmount}
      />

      <TransactionTypeSelector 
        type={type} 
        onTypeChange={setType}
        disablePending={disablePendingType} 
      />

      <TransactionMethodSelector method={method} onMethodChange={setMethod} />

      <CategorySelector 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        registerType={registerType}
      />

      {selectedCategory && (
        <SubcategorySelector 
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={setSelectedSubcategory}
        />
      )}

      <ClientField
        clientId={clientId}
        setClientId={setClientId}
      />

      <StaffField
        staffId={staffId}
        setStaffId={setStaffId}
      />

      <FormActions
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
