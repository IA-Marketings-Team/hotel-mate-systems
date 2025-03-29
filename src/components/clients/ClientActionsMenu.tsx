
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Receipt, 
  Download, 
  Utensils, 
  Wine,
  CircleDollarSign,
  ListTodo
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ClientActionsMenuProps {
  clientId: string;
  onExportHistory: () => void;
}

export const ClientActionsMenu = ({
  clientId,
  onExportHistory
}: ClientActionsMenuProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Actions client</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate(`/client/${clientId}/actions`)}>
            <ListTodo className="h-4 w-4 mr-2" />
            Toutes les actions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportHistory}>
            <Download className="h-4 w-4 mr-2" />
            Exporter l'historique
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
