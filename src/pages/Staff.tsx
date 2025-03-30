import React, { useState } from "react";
import { StaffMember, useStaff } from "@/hooks/useStaff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffDirectory } from "@/components/staff/StaffDirectory";
import { StaffScheduler } from "@/components/staff/StaffScheduler";
import { StaffTasks } from "@/components/staff/StaffTasks";
import { StaffTeams } from "@/components/staff/StaffTeams";
import { StaffTracking } from "@/components/staff/StaffTracking";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Users, 
  Clock, 
  ListTodo, 
  UserCheck, 
  UserPlus, 
  MessageSquare,
  BookOpen,
  FileArchive,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const { data: staffMembers, isLoading, error } = useStaff();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Erreur lors du chargement des données</h3>
        <p className="text-red-600 mt-2">{error.message}</p>
      </div>
    );
  }

  const filteredStaff = staffMembers?.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.contactNumber.includes(searchTerm);

    const matchesRole = roleFilter === "all" || staff.role === roleFilter;

    const matchesShift = shiftFilter === "all" || staff.shift === shiftFilter;

    return matchesSearch && matchesRole && matchesShift;
  }) || [];

  const getRoleName = (role: string) => {
    switch (role) {
      case "manager":
        return "Directeur";
      case "receptionist":
        return "Réceptionniste";
      case "housekeeper":
        return "Femme de chambre";
      case "waiter":
        return "Serveur";
      case "chef":
        return "Chef";
      case "bartender":
        return "Barman";
      case "maintenance":
        return "Maintenance";
      default:
        return role;
    }
  };

  const getShiftName = (shift: string) => {
    switch (shift) {
      case "morning":
        return "Matin";
      case "afternoon":
        return "Après-midi";
      case "night":
        return "Nuit";
      default:
        return shift;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "receptionist":
        return "bg-blue-100 text-blue-800";
      case "housekeeper":
        return "bg-green-100 text-green-800";
      case "waiter":
        return "bg-yellow-100 text-yellow-800";
      case "chef":
        return "bg-red-100 text-red-800";
      case "bartender":
        return "bg-orange-100 text-orange-800";
      case "maintenance":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion du Personnel</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </div>

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

        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <UserCheck className="h-4 w-4 mr-2" />
            Recrutement
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Onboarding
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <FileArchive className="h-4 w-4 mr-2" />
            Documents RH
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Engagement
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Rapports
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Conformité
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Communication
          </Button>
        </div>

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
    </div>
  );
};

export default Staff;
