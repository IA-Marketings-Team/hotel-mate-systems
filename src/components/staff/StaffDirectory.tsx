
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { StaffSearchFilter } from "./directory/StaffSearchFilter";
import { StaffList } from "./directory/StaffList";

interface StaffDirectoryProps {
  staffMembers: StaffMember[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  shiftFilter: string;
  setShiftFilter: (value: string) => void;
  getRoleName: (role: string) => string;
  getShiftName: (shift: string) => string;
  getRoleColor: (role: string) => string;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({
  staffMembers,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  shiftFilter,
  setShiftFilter,
  getRoleName,
  getShiftName,
  getRoleColor,
}) => {
  return (
    <div className="space-y-6">
      <StaffSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
      />
      <StaffList
        staffMembers={staffMembers}
        getRoleName={getRoleName}
        getShiftName={getShiftName}
        getRoleColor={getRoleColor}
      />
    </div>
  );
};
