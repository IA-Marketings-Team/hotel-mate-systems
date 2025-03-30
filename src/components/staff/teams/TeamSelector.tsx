
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "./types";

interface TeamSelectorProps {
  teams: Team[];
  selectedTeam: string;
  onSelectTeam: (value: string) => void;
}

export const TeamSelector: React.FC<TeamSelectorProps> = ({
  teams,
  selectedTeam,
  onSelectTeam,
}) => {
  return (
    <Select value={selectedTeam} onValueChange={onSelectTeam}>
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
  );
};
