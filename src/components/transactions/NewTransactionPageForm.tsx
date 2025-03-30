import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaff } from "@/hooks/useStaff";
import { useClients } from "@/hooks/useClients";
import { RegisterType } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";
import { TransactionTypeSelector } from "@/components/transactions/TransactionTypeSelector";
import { TransactionMethodSelector } from "@/components/transactions/TransactionMethodSelector";
import { CategorySelector } from "@/components/transactions/CategorySelector";
import { SubcategorySelector } from "@/components/transactions/SubcategorySelector";
import { DescriptionField } from "@/components/transactions/form-fields/DescriptionField";
import { AmountField } from "@/components/transactions/form-fields/AmountField";
import { ClientField } from "@/components/transactions/form-fields/ClientField";
import { StaffField } from "@/components/transactions/form-fields/StaffField";
import { FormActions } from "@/components/transactions/form-fields/FormActions";
import { RegisterTypeField } from "@/components/transactions/form-fields/RegisterTypeField";

interface NewTransactionPageFormProps {
  initialRegisterType: RegisterType;
  initialDescription?: string;
  initialType?: "payment" | "refund" | "pending" | "partial";
  initialClientId?: string;
}

export const NewTransactionPageForm = ({ 
  initialRegisterType,
  initialDescription = "",
  initialType = "payment",
  initialClientId = "none"
}: NewTransactionPageFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTransaction } = useTransactions();
  
  // Form state
  const [type, setType] = useState<"payment" | "refund" | "pending" | "partial">(initialType);
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("card");
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [clientId, setClientId] = useState(initialClientId);
  const [staffId, setStaffId] = useState("none");
  const [registerType, setRegisterType] = useState<RegisterType>(initialRegisterType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createTransaction.mutateAsync({
        description,
        amount: parseFloat(amount),
        type,
        method,
        registerType,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        clientId: clientId === "none" ? null : clientId,
        staffId: staffId === "none" ? null : staffId,
      });

      toast.success("Transaction créée avec succès");
      
      // If it's a pending transaction (invoice), redirect to invoices
      if (type === "pending") {
        navigate("/invoices");
      } else {
        // Otherwise, redirect to registers
        navigate("/registers");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Erreur lors de la création de la transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/registers");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RegisterTypeField 
        registerType={registerType} 
        setRegisterType={setRegisterType} 
      />
      
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
        disablePending={false}
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
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Créer la transaction"
      />
    </form>
  );
};
