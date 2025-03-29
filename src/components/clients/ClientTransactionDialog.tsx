
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";

interface ClientTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
  initialType?: "payment" | "refund" | "pending" | "partial";
  initialDescription?: string;
}

export const ClientTransactionDialog = ({ 
  open, 
  onOpenChange, 
  clientId,
  clientName,
  onSuccess,
  initialType,
  initialDescription
}: ClientTransactionDialogProps) => {
  const { createTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createTransaction.mutateAsync({
        description: data.description,
        amount: parseFloat(data.amount),
        type: data.type,
        method: data.method,
        registerType: 'hotel',
        category: data.category,
        subcategory: data.subcategory,
        clientId: data.clientId,
        staffId: data.staffId,
      });

      toast.success("Transaction créée avec succès");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Erreur lors de la création de la transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction - {clientName}</DialogTitle>
        </DialogHeader>
        <TransactionForm 
          registerType="hotel"
          clientId={clientId}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          initialType={initialType}
          initialDescription={initialDescription}
        />
      </DialogContent>
    </Dialog>
  );
};
