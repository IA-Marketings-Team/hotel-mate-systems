
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
  onNewTransaction: () => void;
  onExportHistory: () => void;
  onRestaurantOrder: () => void;
  onBarOrder: () => void;
  onPokerTokens: () => void;
}

export const ClientActionsMenu = ({
  clientId,
  onNewTransaction,
  onExportHistory,
  onRestaurantOrder,
  onBarOrder,
  onPokerTokens
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
          <DropdownMenuItem onClick={onNewTransaction}>
            <Receipt className="h-4 w-4 mr-2" />
            Nouvelle transaction
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportHistory}>
            <Download className="h-4 w-4 mr-2" />
            Exporter l'historique
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Services</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onRestaurantOrder}>
            <Utensils className="h-4 w-4 mr-2" />
            Commande restaurant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBarOrder}>
            <Wine className="h-4 w-4 mr-2" />
            Commande bar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPokerTokens}>
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Achat jetons poker
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
