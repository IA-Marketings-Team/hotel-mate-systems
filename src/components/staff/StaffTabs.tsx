
import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { StaffMember } from "@/hooks/useStaff";
import { TabTriggers } from "./tabs/TabTriggers";
import { TabContent } from "./tabs/TabContent";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("directory");
  
  // Check for navigation state to determine active tab
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabTriggers />
      
      {["directory", "scheduler", "tasks", "teams", "tracking"].map(tab => (
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
          setActiveTab={setActiveTab}
        />
      ))}
    </Tabs>
  );
};
