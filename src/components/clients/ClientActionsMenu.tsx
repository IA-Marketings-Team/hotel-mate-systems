
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Receipt, 
  Download, 
  Utensils, 
  Wine
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
  onNewTransaction: () => void;
  onExportHistory: () => void;
  onRestaurantOrder: () => void;
  onBarOrder: () => void;
  onPokerTokens: () => void;
}

export const ClientActionsMenu = ({
  onNewTransaction,
  onExportHistory,
  onRestaurantOrder,
  onBarOrder,
  onPokerTokens
}: ClientActionsMenuProps) => {
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
            {/* Fixed: Using a different icon instead of Poker which doesn't exist */}
            <Receipt className="h-4 w-4 mr-2" />
            Achat jetons poker
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
