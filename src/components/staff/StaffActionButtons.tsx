
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  UserCheck, 
  BookOpen, 
  FileArchive, 
  TrendingUp, 
  FileText, 
  ShieldCheck, 
  MessageSquare 
} from "lucide-react";

export const StaffActionButtons: React.FC = () => {
  return (
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
  );
};
