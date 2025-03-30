
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface StaffHeaderProps {
  title: string;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button>
        <UserPlus className="h-4 w-4 mr-2" />
        Ajouter un employé
      </Button>
    </div>
  );
};
