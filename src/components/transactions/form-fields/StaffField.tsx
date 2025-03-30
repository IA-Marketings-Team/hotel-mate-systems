
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";

interface StaffFieldProps {
  staffId: string;
  setStaffId: (value: string) => void;
}

export function StaffField({ staffId, setStaffId }: StaffFieldProps) {
  const { data: staff, isLoading: isStaffLoading } = useStaff();

  return (
    <div>
      <Label htmlFor="staffId">Personnel</Label>
      <Select value={staffId} onValueChange={setStaffId}>
        <SelectTrigger id="staffId">
          <SelectValue placeholder="Sélectionner un membre du personnel (optionnel)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Aucun personnel</SelectItem>
          {staff?.map((staffMember) => (
            <SelectItem key={staffMember.id} value={staffMember.id}>
              {staffMember.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
