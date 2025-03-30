
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Team } from "./types";

interface TeamHeaderProps {
  team: Team;
  getStaffName: (staffId: string) => string;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({ team, getStaffName }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Département: <span className="font-medium">{team.department}</span>
          </p>
          {team.leader && (
            <p className="text-sm text-muted-foreground mt-1">
              Responsable: <span className="font-medium">{getStaffName(team.leader)}</span>
            </p>
          )}
        </div>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter membre
        </Button>
      </div>
    </div>
  );
};
