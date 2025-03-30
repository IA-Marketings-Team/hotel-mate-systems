
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { TeamMemberCard } from "./TeamMemberCard";
import { Team } from "./types";

interface TeamMembersListProps {
  team: Team;
  teamMembers: StaffMember[];
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({
  team,
  teamMembers,
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {teamMembers.map((member) => (
        <TeamMemberCard 
          key={member.id} 
          member={member} 
          isTeamLeader={team.leader === member.id} 
        />
      ))}
    </div>
  );
};
