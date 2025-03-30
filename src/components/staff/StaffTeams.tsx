
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, UserPlus } from "lucide-react";

interface StaffTeamsProps {
  staffMembers: StaffMember[];
}

type Team = {
  id: string;
  name: string;
  department: string;
  members: string[];
  leader?: string;
};

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Sélectionner une équipe" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name} ({team.department})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle équipe
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle équipe</DialogTitle>
              <DialogDescription>
                Définissez le nom et le département de votre nouvelle équipe
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Nom de l'équipe</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ex: Service petit-déjeuner"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={newTeamDept}
                  onChange={(e) => setNewTeamDept(e.target.value)}
                  placeholder="Ex: Restauration"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateTeam}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {currentTeam && (
        <DashboardCard title={`Équipe : ${currentTeam.name}`}>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Département: <span className="font-medium">{currentTeam.department}</span>
                </p>
                {currentTeam.leader && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Responsable: <span className="font-medium">{getStaffName(currentTeam.leader)}</span>
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter membre
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {getTeamMembers(currentTeam.id).map((member) => (
              <Card key={member.id} className="border shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    {member.name}
                    {currentTeam.leader === member.id && (
                      <Badge className="ml-2 bg-amber-100 text-amber-800">
                        Chef d'équipe
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    Poste: {member.role === "receptionist" ? "Réceptionniste" : 
                            member.role === "housekeeper" ? "Femme de chambre" :
                            member.role === "waiter" ? "Serveur" :
                            member.role === "chef" ? "Chef" :
                            member.role === "bartender" ? "Barman" :
                            member.role === "maintenance" ? "Maintenance" :
                            member.role === "manager" ? "Directeur" : member.role}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Service: {member.shift === "morning" ? "Matin" :
                             member.shift === "afternoon" ? "Après-midi" :
                             member.shift === "night" ? "Nuit" : member.shift}
                  </p>
                  <div className="flex justify-end mt-3">
                    <Button variant="ghost" size="sm">
                      Voir profil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
};
