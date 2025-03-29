import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useClients } from "@/hooks/useClients";
import { useTransactions } from "@/hooks/useTransactions";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mail, 
  Phone, 
  Plus, 
  UserIcon, 
  Download, 
  Search 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { generatePDF } from "@/lib/pdfUtils";
import { toast } from "sonner";

const Clients = () => {
  const { data: clients, isLoading, error } = useClients();
  const { data: transactions } = useTransactions();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportClientHistory = (client: Client) => {
    if (!transactions) {
      toast.error("Impossible de générer le rapport: données de transactions non disponibles");
      return;
    }

    const clientTransactions = transactions.filter(t => t.clientId === client.id);
    
    if (clientTransactions.length === 0) {
      toast.info("Aucune transaction à exporter pour ce client");
      return;
    }

    const tableData = clientTransactions.map(t => [
      format(new Date(t.date), "dd/MM/yyyy"),
      t.registerType,
      t.type === "payment" ? "Paiement" : "Remboursement",
      t.description,
      t.amount.toFixed(2) + " €"
    ]);

    const docDefinition = {
      title: `Historique des transactions - ${client.name}`,
      headers: ["Date", "Service", "Type", "Description", "Montant"],
      data: tableData,
      client: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        postalCode: client.postalCode,
        country: client.country
      }
    };

    try {
      generatePDF(docDefinition);
      toast.success("Historique exporté avec succès");
    } catch (err) {
      toast.error(`Erreur lors de l'exportation: ${(err as Error).message}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Clients</h1>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => navigate("/client/new")} 
              className="flex items-center gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Nouveau Client
            </Button>
          </div>
        </div>

        <DashboardCard title="Liste des Clients">
          {isLoading ? (
            <div className="p-6 text-center">Chargement des clients...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Une erreur est survenue: {(error as Error).message}
            </div>
          ) : !filteredClients?.length ? (
            <div className="p-6 text-center text-muted-foreground">
              {searchTerm ? "Aucun client trouvé pour cette recherche" : "Aucun client trouvé"}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClients.map((client) => (
                <ClientCard 
                  key={client.id} 
                  client={client} 
                  onClick={() => navigate(`/client/${client.id}`)}
                  onExport={() => handleExportClientHistory(client)}
                />
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

interface ClientCardProps {
  client: Client;
  onClick: () => void;
  onExport: () => void;
}

const ClientCard = ({ client, onClick, onExport }: ClientCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={onClick}
        >
          <UserIcon className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-lg">{client.name}</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          {client.createdAt && format(new Date(client.createdAt), "dd/MM/yyyy")}
        </div>
      </div>
      
      <div 
        className="mt-4 space-y-2 cursor-pointer"
        onClick={onClick}
      >
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
      
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onExport();
          }}
        >
          <Download className="h-3.5 w-3.5 mr-1" />
          Exporter l'historique
        </Button>
      </div>
    </div>
  );
};

export default Clients;
