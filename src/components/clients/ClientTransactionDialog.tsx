
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";

interface ClientTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
  initialType?: "payment" | "refund";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction - {clientName}</DialogTitle>
        </DialogHeader>
        <TransactionForm 
          registerType="hotel"
          clientId={clientId}
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
          initialType={initialType}
          initialDescription={initialDescription}
        />
      </DialogContent>
    </Dialog>
  );
};
