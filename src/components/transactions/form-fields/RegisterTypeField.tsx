
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegisterType } from "@/types";

interface RegisterTypeFieldProps {
  registerType: RegisterType;
  setRegisterType: (value: RegisterType) => void;
}

export function RegisterTypeField({ registerType, setRegisterType }: RegisterTypeFieldProps) {
  return (
    <div>
      <Label htmlFor="register-type">Caisse</Label>
      <Select value={registerType} onValueChange={(value) => setRegisterType(value as RegisterType)}>
        <SelectTrigger id="register-type">
          <SelectValue placeholder="Sélectionner une caisse" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hotel">Hôtel</SelectItem>
          <SelectItem value="restaurant">Restaurant</SelectItem>
          <SelectItem value="poker">Poker</SelectItem>
          <SelectItem value="rooftop">Rooftop</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
