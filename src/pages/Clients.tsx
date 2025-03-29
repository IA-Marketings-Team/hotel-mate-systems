
import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useClients } from "@/hooks/useClients";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Phone, Plus, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Clients = () => {
  const { data: clients, isLoading, error } = useClients();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Clients</h1>
          <Button 
            onClick={() => navigate("/client/new")} 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau Client
          </Button>
        </div>

        <DashboardCard title="Liste des Clients">
          {isLoading ? (
            <div className="p-6 text-center">Chargement des clients...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Une erreur est survenue: {(error as Error).message}
            </div>
          ) : !clients?.length ? (
            <div className="p-6 text-center text-muted-foreground">
              Aucun client trouvé
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onClick={() => navigate(`/client/${client.id}`)}
                />
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

const ClientCard = ({ client, onClick }: { client: Client, onClick: () => void }) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-lg">{client.name}</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {client.createdAt && format(new Date(client.createdAt), "dd/MM/yyyy")}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{client.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{client.phone}</span>
        </div>
        {client.address && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <div>
              <div>{client.address}</div>
              {client.city && client.postalCode && (
                <div>{client.postalCode} {client.city}</div>
              )}
              {client.country && <div>{client.country}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
