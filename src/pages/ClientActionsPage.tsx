
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useClient } from "@/hooks/useClients";
import { ClientActions } from "@/components/clients/ClientActions";

const ClientActionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading, error } = useClient(id);

  const handleTransactionSuccess = () => {
    // Optionally navigate back to client details after transaction
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-xl">Chargement...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !client) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-xl text-red-500">
            {error ? `Erreur: ${(error as Error).message}` : "Client non trouvé"}
          </div>
          <Button onClick={() => navigate("/clients")}>
            Retour à la liste des clients
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(`/client/${client.id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Actions pour {client.name}</h1>
          </div>
        </div>

        <ClientActions 
          clientId={client.id} 
          clientName={client.name}
          onTransactionSuccess={handleTransactionSuccess}
        />
      </div>
    </AppLayout>
  );
};

export default ClientActionsPage;
