
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  Mail, 
  Phone, 
  Trash, 
  User, 
  MapPin,
  Globe
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { ClientForm } from "@/components/clients/ClientForm";
import { Transaction } from "@/types";
import { TransactionTable } from "@/components/registers/TransactionTable";
import { TransactionDetailsSheet } from "@/components/transactions/TransactionDetailsSheet";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdfUtils";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading, error, mutations } = useClients(id);
  const { data: transactions } = useTransactions({ clientId: id });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false);

  const handleDelete = async () => {
    if (!client) return;
    
    try {
      await mutations.deleteClient.mutateAsync(client.id);
      toast.success("Client supprimé avec succès");
      navigate("/clients");
    } catch (err) {
      toast.error(`Erreur lors de la suppression: ${(err as Error).message}`);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!client) return;
    
    try {
      await mutations.updateClient.mutateAsync({ id: client.id, ...data });
      setIsEditing(false);
      toast.success("Client mis à jour avec succès");
    } catch (err) {
      toast.error(`Erreur lors de la mise à jour: ${(err as Error).message}`);
    }
  };

  const handleExportHistory = () => {
    if (!client || !transactions) return;
    
    if (transactions.length === 0) {
      toast.info("Aucune transaction à exporter pour ce client");
      return;
    }

    const tableData = transactions.map(t => [
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

  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionSheetOpen(true);
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
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Détails du Client</h1>
        </div>

        <DashboardCard 
          title="Informations Client"
          action={
            !isEditing && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete}
                >
                  <Trash className="h-3.5 w-3.5 mr-1" />
                  Supprimer
                </Button>
              </div>
            )
          }
        >
          <div className="p-4">
            {isEditing ? (
              <ClientForm 
                onSubmit={handleUpdate} 
                defaultValues={client}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{client.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Client depuis {client.createdAt ? format(new Date(client.createdAt), "MMMM yyyy") : "récemment"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </div>

                  {(client.address || client.city || client.postalCode || client.country) && (
                    <div className="space-y-1.5">
                      {client.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div>{client.address}</div>
                            {client.city && client.postalCode && (
                              <div>{client.postalCode} {client.city}</div>
                            )}
                          </div>
                        </div>
                      )}
                      {client.country && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{client.country}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard 
          title="Historique des Transactions"
          action={
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportHistory}
              className="flex items-center gap-2"
            >
              <Download className="h-3.5 w-3.5" />
              Exporter l'historique
            </Button>
          }
        >
          <div className="p-4">
            {!transactions || transactions.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                Aucune transaction enregistrée pour ce client
              </div>
            ) : (
              <TransactionTable 
                transactions={transactions} 
                isLoading={false}
                onViewDetails={handleViewTransactionDetails}
              />
            )}
          </div>
        </DashboardCard>
      </div>

      <TransactionDetailsSheet
        transaction={selectedTransaction}
        open={isTransactionSheetOpen}
        onOpenChange={setIsTransactionSheetOpen}
      />
    </AppLayout>
  );
};

export default ClientDetails;
