
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { RegisterType } from "@/types";
import { toast } from "sonner";

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerType: RegisterType;
  onSuccess?: () => void;
  clientId?: string;
  initialDescription?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialSubcategory?: string;
}

export function NewTransactionDialog({
  open,
  onOpenChange,
  registerType,
  onSuccess,
  clientId,
  initialDescription,
  initialAmount,
  initialCategory,
  initialSubcategory,
}: NewTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTransaction } = useTransactions();

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createTransaction.mutateAsync({
        description: data.description,
        amount: parseFloat(data.amount),
        type: data.type,
        method: data.method,
        registerType,
        category: data.category,
        subcategory: data.subcategory,
        clientId: data.clientId,
        staffId: data.staffId,
      });

      toast.success("Transaction créée avec succès");
      
      // Close the dialog after successful submission
      onOpenChange(false);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Erreur lors de la création de la transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          registerType={registerType}
          clientId={clientId}
          initialDescription={initialDescription}
          initialAmount={initialAmount}
          initialCategory={initialCategory}
          initialSubcategory={initialSubcategory}
        />
      </DialogContent>
    </Dialog>
  );
}
