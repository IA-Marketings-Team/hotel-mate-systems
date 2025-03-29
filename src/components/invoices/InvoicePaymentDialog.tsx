
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice, InvoicePaymentData } from "@/types/invoice";
import { formatCurrency } from "@/lib/utils";

interface InvoicePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSubmit: (data: InvoicePaymentData) => Promise<void>;
  isSubmitting: boolean;
}

export function InvoicePaymentDialog({
  open,
  onOpenChange,
  invoice,
  onSubmit,
  isSubmitting
}: InvoicePaymentDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("card");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoice) return;
    
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    await onSubmit({
      invoiceId: invoice.id,
      amount,
      method: paymentMethod
    });
    
    setPaymentAmount("");
    onOpenChange(false);
  };

  // When dialog opens, set default payment amount to remaining amount
  React.useEffect(() => {
    if (open && invoice) {
      const remaining = invoice.remainingAmount || invoice.amount;
      setPaymentAmount(remaining.toString());
    }
  }, [open, invoice]);

  if (!invoice) return null;

  const maxPayment = invoice.remainingAmount || invoice.amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Facture #{invoice.invoiceNumber} - {formatCurrency(invoice.amount)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Montant total:</span>
              <span className="font-medium">{formatCurrency(invoice.amount)}</span>
            </div>
            
            {invoice.paidAmount ? (
              <div className="flex justify-between text-sm">
                <span>Déjà payé:</span>
                <span className="font-medium text-green-600">{formatCurrency(invoice.paidAmount)}</span>
              </div>
            ) : null}
            
            <div className="flex justify-between text-sm font-medium">
              <span>Reste à payer:</span>
              <span className={invoice.remainingAmount ? "text-amber-600" : ""}>
                {formatCurrency(maxPayment)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant du paiement</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={maxPayment}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select value={paymentMethod} onValueChange={(value: "cash" | "card" | "transfer") => setPaymentMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Traitement en cours..." : "Valider le paiement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
