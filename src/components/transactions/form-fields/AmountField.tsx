
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AmountFieldProps {
  amount: string;
  setAmount: (value: string) => void;
}

export function AmountField({ amount, setAmount }: AmountFieldProps) {
  return (
    <div>
      <Label htmlFor="amount">Montant</Label>
      <Input
        id="amount"
        type="number"
        placeholder="0.00"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
    </div>
  );
}
