
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Check, X } from "lucide-react";
import { StaffProfileDialog } from "./StaffProfileDialog";

interface StaffCardProps {
  staff: StaffMember;
  getRoleName: (role: string) => string;
  getShiftName: (shift: string) => string;
  getRoleColor: (role: string) => string;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  staff,
  getRoleName,
  getShiftName,
  getRoleColor,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">{staff.name}</h3>
        <Badge className={getRoleColor(staff.role)}>
          {getRoleName(staff.role)}
        </Badge>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-muted-foreground" />
          <span className="text-sm">{staff.contactNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-muted-foreground" />
          <span className="text-sm">{staff.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Service:</span>
          <span className="text-sm font-medium">{getShiftName(staff.shift)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Disponible:</span>
          {staff.isAvailable ? (
            <div className="flex items-center gap-1 text-green-500">
              <Check className="size-4" />
              <span className="text-sm font-medium">Oui</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <X className="size-4" />
              <span className="text-sm font-medium">Non</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <StaffProfileDialog staff={staff} getRoleName={getRoleName} getShiftName={getShiftName} />
        <Button variant="default" size="sm">
          Contacter
        </Button>
      </div>
    </div>
  );
};
