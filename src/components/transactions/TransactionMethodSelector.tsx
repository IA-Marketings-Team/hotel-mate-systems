
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionMethodSelectorProps {
  method: "cash" | "card" | "transfer";
  onMethodChange: (value: "cash" | "card" | "transfer") => void;
}

export function TransactionMethodSelector({ method, onMethodChange }: TransactionMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="method">Méthode</Label>
      <Select
        value={method}
        onValueChange={(value) => onMethodChange(value as "cash" | "card" | "transfer")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une méthode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cash">Espèces</SelectItem>
          <SelectItem value="card">Carte</SelectItem>
          <SelectItem value="transfer">Virement</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
