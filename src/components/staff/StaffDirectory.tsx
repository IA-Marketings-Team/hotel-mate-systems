
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { useQueryClient } from "@tanstack/react-query";
import { StaffSearchFilter } from "./directory/StaffSearchFilter";
import { StaffList } from "./directory/StaffList";
import { StaffActionsMenu } from "./directory/StaffActionsMenu";

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
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ['staff'] })
      .finally(() => setIsRefreshing(false));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <StaffSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          shiftFilter={shiftFilter}
          setShiftFilter={setShiftFilter}
        />
        <StaffActionsMenu onRefresh={handleRefresh} isRefreshing={isRefreshing} />
      </div>
      <StaffList
        staffMembers={staffMembers}
        getRoleName={getRoleName}
        getShiftName={getShiftName}
        getRoleColor={getRoleColor}
      />
    </div>
  );
};
