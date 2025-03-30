
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StaffMember } from "@/hooks/useStaff";
import { getRoleName, getShiftName } from "@/utils/staffUtils";

interface TeamMemberCardProps {
  member: StaffMember;
  isTeamLeader: boolean;
  onPromoteToLeader?: () => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  isTeamLeader,
  onPromoteToLeader
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
          Poste: {getRoleName(member.role)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Service: {getShiftName(member.shift)}
        </p>
        <div className="flex justify-between mt-3">
          <Button variant="ghost" size="sm">
            Voir profil
          </Button>
          
          {!isTeamLeader && onPromoteToLeader && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onPromoteToLeader}
                  className="text-amber-600 border-amber-200 hover:bg-amber-50"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Chef d'équipe
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Promouvoir comme chef d'équipe</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
