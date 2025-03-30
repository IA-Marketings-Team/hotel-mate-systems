
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { TeamMemberCard } from "./TeamMemberCard";
import { Team } from "./types";
import { toast } from "sonner";

interface TeamMembersListProps {
  team: Team;
  teamMembers: StaffMember[];
  onPromoteMember: (teamId: string, memberId: string) => void;
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({
  team,
  teamMembers,
  onPromoteMember,
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {teamMembers.map((member) => (
        <TeamMemberCard 
          key={member.id} 
          member={member} 
          isTeamLeader={team.leader === member.id}
          onPromoteToLeader={() => {
            onPromoteMember(team.id, member.id);
            toast.success(`${member.name} promu chef d'équipe`);
          }}
        />
      ))}
    </div>
  );
};
