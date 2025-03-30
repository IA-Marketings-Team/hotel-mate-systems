
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffMember } from "@/hooks/useStaff";
import { StaffDirectory } from "./StaffDirectory";
import { StaffScheduler } from "./StaffScheduler";
import { StaffTasks } from "./StaffTasks";
import { StaffTeams } from "./StaffTeams";
import { StaffTracking } from "./StaffTracking";
import { Calendar, Users, Clock, ListTodo } from "lucide-react";
import { getRoleName, getShiftName, getRoleColor } from "@/utils/staffUtils";

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
  return (
    <Tabs defaultValue="directory" className="w-full">
      <TabsList className="grid grid-cols-5 mb-8">
        <TabsTrigger value="directory" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Annuaire</span>
        </TabsTrigger>
        <TabsTrigger value="scheduler" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Planning</span>
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          <span className="hidden sm:inline">Tâches</span>
        </TabsTrigger>
        <TabsTrigger value="teams" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Équipes</span>
        </TabsTrigger>
        <TabsTrigger value="tracking" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Suivi</span>
        </TabsTrigger>
      </TabsList>

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

      <TabsContent value="scheduler">
        <StaffScheduler staffMembers={staffMembers || []} />
      </TabsContent>

      <TabsContent value="tasks">
        <StaffTasks staffMembers={staffMembers || []} />
      </TabsContent>

      <TabsContent value="teams">
        <StaffTeams staffMembers={staffMembers || []} />
      </TabsContent>

      <TabsContent value="tracking">
        <StaffTracking staffMembers={staffMembers || []} />
      </TabsContent>
    </Tabs>
  );
};
