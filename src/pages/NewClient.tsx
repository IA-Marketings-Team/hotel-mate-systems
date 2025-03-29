
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";

const NewClient = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();

  const handleSubmit = async (data: any) => {
    try {
      const result = await addClient.mutateAsync(data);
      toast.success("Client ajouté avec succès");
      navigate(`/client/${result.id}`);
    } catch (err) {
      toast.error(`Erreur lors de l'ajout: ${(err as Error).message}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Nouveau Client</h1>
        </div>

        <DashboardCard title="Informations Client">
          <div className="p-4">
            <ClientForm onSubmit={handleSubmit} />
          </div>
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

export default NewClient;
