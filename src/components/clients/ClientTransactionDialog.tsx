
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTransactions } from "@/hooks/useTransactions";
import { RegisterType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TransactionTypeSelector } from "@/components/transactions/TransactionTypeSelector";
import { TransactionMethodSelector } from "@/components/transactions/TransactionMethodSelector";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";

interface ClientTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onSuccess?: () => void;
}

export function ClientTransactionDialog({
  open,
  onOpenChange,
  clientId,
  clientName,
  onSuccess
}: ClientTransactionDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"payment" | "refund">("payment");
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [registerType, setRegisterType] = useState<RegisterType>("hotel");

  const { createTransaction } = useTransactions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createTransaction.mutateAsync({
        description,
        amount: parseFloat(amount),
        type,
        method,
        registerType,
        clientId
      });

      toast.success("La transaction a été ajoutée avec succès");
      onOpenChange(false);
      setDescription("");
      setAmount("");
      setType("payment");
      setMethod("cash");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error(`Impossible de créer la transaction: ${(error as Error).message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle transaction pour {clientName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-type">Service</Label>
            <Select
              value={registerType}
              onValueChange={(value) => setRegisterType(value as RegisterType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hôtel</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="poker">Poker</SelectItem>
                <SelectItem value="rooftop">Rooftop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TransactionTypeSelector type={type} onTypeChange={setType} />
            <TransactionMethodSelector method={method} onMethodChange={setMethod} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la transaction"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={createTransaction.isPending}
            >
              {createTransaction.isPending ? "Traitement..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
