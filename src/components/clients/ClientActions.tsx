
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { ClientTransactionDialog } from "@/components/clients/ClientTransactionDialog";
import { toast } from "sonner";
import { 
  Receipt, 
  Utensils, 
  Wine,
  CircleDollarSign
} from "lucide-react";

interface ClientActionsProps {
  clientId: string;
  clientName: string;
  onTransactionSuccess?: () => void;
}

export const ClientActions = ({
  clientId,
  clientName,
  onTransactionSuccess
}: ClientActionsProps) => {
  const navigate = useNavigate();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [serviceType, setServiceType] = useState<"general" | "restaurant" | "bar" | "poker">("general");

  const handleTransactionSuccess = () => {
    if (onTransactionSuccess) {
      onTransactionSuccess();
    }
    toast.success("Transaction ajoutée avec succès");
  };

  const openTransactionDialog = (type: "general" | "restaurant" | "bar" | "poker") => {
    setServiceType(type);
    setIsTransactionDialogOpen(true);
  };

  return (
    <>
      <DashboardCard title="Actions Client">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-medium text-lg mb-3">Transactions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => openTransactionDialog("general")}
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
                onClick={() => openTransactionDialog("restaurant")}
              >
                <Utensils className="h-4 w-4 mr-2" />
                Commande restaurant
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => openTransactionDialog("bar")}
              >
                <Wine className="h-4 w-4 mr-2" />
                Commande bar
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => openTransactionDialog("poker")}
              >
                <CircleDollarSign className="h-4 w-4 mr-2" />
                Achat jetons poker
              </Button>
            </div>
          </div>
        </div>
      </DashboardCard>

      <ClientTransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        clientId={clientId}
        clientName={clientName}
        onSuccess={handleTransactionSuccess}
        initialType={serviceType === "general" ? "payment" : "payment"}
        initialDescription={
          serviceType === "restaurant" ? "Commande restaurant" :
          serviceType === "bar" ? "Commande bar" :
          serviceType === "poker" ? "Achat jetons poker" : ""
        }
      />
    </>
  );
};
