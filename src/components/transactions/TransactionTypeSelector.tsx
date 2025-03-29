
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TransactionTypeSelectorProps {
  type: "payment" | "refund" | "pending";
  onTypeChange: (value: "payment" | "refund" | "pending") => void;
}

export function TransactionTypeSelector({ 
  type, 
  onTypeChange 
}: TransactionTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Type de transaction</Label>
      <RadioGroup
        value={type}
        onValueChange={(value) => onTypeChange(value as "payment" | "refund" | "pending")}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="payment" id="payment" />
          <Label htmlFor="payment" className="font-normal cursor-pointer">Paiement</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="refund" id="refund" />
          <Label htmlFor="refund" className="font-normal cursor-pointer">Remboursement</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pending" id="pending" />
          <Label htmlFor="pending" className="font-normal cursor-pointer">À payer plus tard</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
