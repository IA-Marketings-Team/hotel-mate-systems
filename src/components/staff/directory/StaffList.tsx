
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { StaffCard } from "./StaffCard";

interface StaffListProps {
  staffMembers: StaffMember[];
  getRoleName: (role: string) => string;
  getShiftName: (shift: string) => string;
  getRoleColor: (role: string) => string;
}

export const StaffList: React.FC<StaffListProps> = ({
  staffMembers,
  getRoleName,
  getShiftName,
  getRoleColor,
}) => {
  if (staffMembers.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-muted-foreground">Aucun employé trouvé avec ces critères</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {staffMembers.map((staff) => (
        <StaffCard
          key={staff.id}
          staff={staff}
          getRoleName={getRoleName}
          getShiftName={getShiftName}
          getRoleColor={getRoleColor}
        />
      ))}
    </div>
  );
};
