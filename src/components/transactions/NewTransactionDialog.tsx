
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RegisterType } from "@/types";
import { TransactionForm } from "./TransactionForm";

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerType: RegisterType;
  onSuccess: () => void;
  clientId?: string;
  initialType?: "payment" | "refund";
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
  initialType = "payment",
  initialDescription = "",
  initialAmount,
  initialCategory,
  initialSubcategory
}: NewTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction</DialogTitle>
          <DialogDescription>
            Créez une nouvelle transaction pour la caisse {registerType}.
          </DialogDescription>
        </DialogHeader>
        <TransactionForm 
          registerType={registerType}
          clientId={clientId}
          initialDescription={initialDescription}
          initialAmount={initialAmount}
          initialCategory={initialCategory}
          initialSubcategory={initialSubcategory}
          initialType={initialType}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
