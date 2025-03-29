
import React from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  Utensils, 
  Wine,
  CircleDollarSign
} from "lucide-react";

interface ClientActionsProps {
  clientId: string;
  clientName: string;
}

export const ClientActions = ({
  clientId,
  clientName,
}: ClientActionsProps) => {
  const navigate = useNavigate();

  const navigateToNewTransaction = (type: "general" | "restaurant" | "bar" | "poker") => {
    let initialDescription = "";
    let registerType = "hotel";
    
    switch (type) {
      case "restaurant":
        initialDescription = "Commande restaurant";
        registerType = "restaurant";
        break;
      case "bar":
        initialDescription = "Commande bar";
        registerType = "restaurant";
        break;
      case "poker":
        initialDescription = "Achat jetons poker";
        registerType = "poker";
        break;
    }
    
    navigate("/transaction/new", { 
      state: { 
        clientId,
        initialDescription,
        registerType: registerType as any,
        initialType: "payment"
      } 
    });
  };

  return (
    <DashboardCard title="Actions Client">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-medium text-lg mb-3">Transactions</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigateToNewTransaction("general")}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Nouvelle transaction
            </Button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-medium text-lg mb-3">Services</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigateToNewTransaction("restaurant")}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Commande restaurant
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigateToNewTransaction("bar")}
            >
              <Wine className="h-4 w-4 mr-2" />
              Commande bar
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigateToNewTransaction("poker")}
            >
              <CircleDollarSign className="h-4 w-4 mr-2" />
              Achat jetons poker
            </Button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
