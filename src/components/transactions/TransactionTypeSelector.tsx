
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionTypeSelectorProps {
  type: "payment" | "refund" | "pending";
  onTypeChange: (value: "payment" | "refund" | "pending") => void;
}

export function TransactionTypeSelector({ type, onTypeChange }: TransactionTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Type</Label>
      <Select
        value={type}
        onValueChange={(value) => onTypeChange(value as "payment" | "refund" | "pending")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="payment">Paiement</SelectItem>
          <SelectItem value="refund">Remboursement</SelectItem>
          <SelectItem value="pending">À payer plus tard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
