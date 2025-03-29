
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RegisterType } from "@/types";
import { TransactionForm } from "./TransactionForm";

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registerType: RegisterType;
  onSuccess: () => void;
  clientId?: string;
}

export function NewTransactionDialog({ 
  open, 
  onOpenChange, 
  registerType,
  onSuccess,
  clientId
}: NewTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm 
          registerType={registerType}
          clientId={clientId}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
