
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { RegisterType } from "@/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
  initialType?: "payment" | "refund" | "pending";
  redirectToInvoices?: boolean;
  disablePendingType?: boolean;
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
  initialType = "payment",
  redirectToInvoices = false,
  disablePendingType = false,
}: NewTransactionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTransaction } = useTransactions();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const result = await createTransaction.mutateAsync({
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

      // If it's a pending transaction and we should redirect to invoices
      if (data.type === "pending" && redirectToInvoices) {
        onOpenChange(false);
        navigate("/invoices", { 
          state: { 
            highlightInvoiceId: result.id,
            openPaymentDialog: false
          } 
        });
        toast.success("Facture créée avec succès");
        return;
      }

      let successMessage = "Transaction créée avec succès";
      if (data.type === "pending") {
        successMessage = "Transaction en attente de paiement créée avec succès";
      }
      
      toast.success(successMessage);
      
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
          <DialogDescription>
            Créez une nouvelle transaction ou enregistrez un paiement futur.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          registerType={registerType}
          clientId={clientId}
          initialDescription={initialDescription}
          initialAmount={initialAmount}
          initialCategory={initialCategory}
          initialSubcategory={initialSubcategory}
          initialType={initialType}
          disablePendingType={disablePendingType}
        />
      </DialogContent>
    </Dialog>
  );
}
