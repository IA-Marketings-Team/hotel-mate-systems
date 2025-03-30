
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { StaffMember } from "@/hooks/useStaff";
import { TabTriggers } from "./tabs/TabTriggers";
import { TabContent } from "./tabs/TabContent";

interface StaffTabsProps {
  staffMembers: StaffMember[];
  filteredStaff: StaffMember[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  shiftFilter: string;
  setShiftFilter: (value: string) => void;
}

export const StaffTabs: React.FC<StaffTabsProps> = ({
  staffMembers,
  filteredStaff,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  shiftFilter,
  setShiftFilter,
}) => {
  const tabs = ["directory", "scheduler", "tasks", "teams", "tracking"];
  
  return (
    <Tabs defaultValue="directory" className="w-full">
      <TabTriggers />
      
      {tabs.map(tab => (
        <TabContent
          key={tab}
          tab={tab}
          staffMembers={staffMembers}
          filteredStaff={filteredStaff}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          shiftFilter={shiftFilter}
          setShiftFilter={setShiftFilter}
        />
      ))}
    </Tabs>
  );
};
