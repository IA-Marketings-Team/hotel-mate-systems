
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { StaffMember } from "@/hooks/useStaff";
import { StaffDirectory } from "../StaffDirectory";
import { StaffScheduler } from "../StaffScheduler";
import { StaffTasks } from "../StaffTasks";
import { StaffTeams } from "../StaffTeams";
import { StaffTracking } from "../StaffTracking";
import { getRoleName, getShiftName, getRoleColor } from "@/utils/staffUtils";

interface TabContentProps {
  tab: string;
  staffMembers: StaffMember[];
  filteredStaff: StaffMember[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  shiftFilter: string;
  setShiftFilter: (value: string) => void;
  setActiveTab: (tab: string) => void;
}

export const TabContent: React.FC<TabContentProps> = ({
  tab,
  staffMembers,
  filteredStaff,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  shiftFilter,
  setShiftFilter,
  setActiveTab,
}) => {
  switch (tab) {
    case "directory":
      return (
        <TabsContent value="directory">
          <StaffDirectory 
            staffMembers={filteredStaff}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            shiftFilter={shiftFilter}
            setShiftFilter={setShiftFilter}
            getRoleName={getRoleName}
            getShiftName={getShiftName}
            getRoleColor={getRoleColor}
          />
        </TabsContent>
      );
    case "scheduler":
      return (
        <TabsContent value="scheduler">
          <StaffScheduler 
            staffMembers={staffMembers || []} 
            onNavigateToTasks={() => setActiveTab("tasks")}
          />
        </TabsContent>
      );
    case "tasks":
      return (
        <TabsContent value="tasks">
          <StaffTasks staffMembers={staffMembers || []} />
        </TabsContent>
      );
    case "teams":
      return (
        <TabsContent value="teams">
          <StaffTeams staffMembers={staffMembers || []} />
        </TabsContent>
      );
    case "tracking":
      return (
        <TabsContent value="tracking">
          <StaffTracking staffMembers={staffMembers || []} />
        </TabsContent>
      );
    default:
      return null;
  }
};
