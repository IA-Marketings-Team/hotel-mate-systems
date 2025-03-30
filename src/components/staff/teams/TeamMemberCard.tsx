
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StaffMember } from "@/hooks/useStaff";

interface TeamMemberCardProps {
  member: StaffMember;
  isTeamLeader: boolean;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  isTeamLeader 
}) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base flex justify-between items-center">
          {member.name}
          {isTeamLeader && (
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
  );
};
