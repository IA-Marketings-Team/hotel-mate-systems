import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { Team } from "./teams/types";
import { TeamSelector } from "./teams/TeamSelector";
import { CreateTeamDialog } from "./teams/CreateTeamDialog";
import { TeamHeader } from "./teams/TeamHeader";
import { TeamMembersList } from "./teams/TeamMembersList";

interface StaffTeamsProps {
  staffMembers: StaffMember[];
}

export const StaffTeams: React.FC<StaffTeamsProps> = ({ staffMembers }) => {
  // Mock teams data
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Accueil",
      department: "Réception",
      members: staffMembers.filter(s => s.role === "receptionist").map(s => s.id),
      leader: staffMembers.find(s => s.role === "receptionist")?.id,
    },
    {
      id: "2",
      name: "Cuisine",
      department: "Restauration",
      members: staffMembers.filter(s => s.role === "chef").map(s => s.id),
      leader: staffMembers.find(s => s.role === "chef")?.id,
    },
    {
      id: "3",
      name: "Service",
      department: "Restauration",
      members: staffMembers.filter(s => s.role === "waiter" || s.role === "bartender").map(s => s.id),
      leader: staffMembers.find(s => s.role === "waiter")?.id,
    },
    {
      id: "4",
      name: "Entretien",
      department: "Maintenance",
      members: staffMembers.filter(s => s.role === "housekeeper" || s.role === "maintenance").map(s => s.id),
      leader: staffMembers.find(s => s.role === "maintenance")?.id,
    },
  ]);

  const [selectedTeam, setSelectedTeam] = useState<string>(teams[0]?.id || "");
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDept, setNewTeamDept] = useState("");
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

  const currentTeam = teams.find(t => t.id === selectedTeam);

  const getTeamMembers = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return [];
    return staffMembers.filter(staff => team.members.includes(staff.id));
  };

  const getStaffName = (staffId: string) => {
    return staffMembers.find(s => s.id === staffId)?.name || "Inconnu";
  };

  const handleCreateTeam = () => {
    if (newTeamName.trim() === "" || newTeamDept.trim() === "") return;

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      department: newTeamDept,
      members: [],
    };

    setTeams([...teams, newTeam]);
    setSelectedTeam(newTeam.id);
    setNewTeamName("");
    setNewTeamDept("");
    setShowNewTeamDialog(false);
  };

  const handlePromoteMember = (teamId: string, memberId: string) => {
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === teamId) {
          return { ...team, leader: memberId };
        }
        return team;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <TeamSelector 
          teams={teams} 
          selectedTeam={selectedTeam} 
          onSelectTeam={setSelectedTeam} 
        />

        <CreateTeamDialog 
          open={showNewTeamDialog}
          onOpenChange={setShowNewTeamDialog}
          newTeamName={newTeamName}
          setNewTeamName={setNewTeamName}
          newTeamDept={newTeamDept}
          setNewTeamDept={setNewTeamDept}
          onCreateTeam={handleCreateTeam}
        />
      </div>

      {currentTeam && (
        <DashboardCard title={`Équipe : ${currentTeam.name}`}>
          <TeamHeader 
            team={currentTeam} 
            getStaffName={getStaffName} 
          />

          <TeamMembersList 
            team={currentTeam} 
            teamMembers={getTeamMembers(currentTeam.id)} 
            onPromoteMember={handlePromoteMember}
          />
        </DashboardCard>
      )}
    </div>
  );
};
