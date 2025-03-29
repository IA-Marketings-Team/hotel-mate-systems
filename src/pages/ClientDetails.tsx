
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useClient, useClients } from "@/hooks/useClients";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { TransactionDetailsSheet } from "@/components/transactions/TransactionDetailsSheet";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdfUtils";
import { ClientTransactionDialog } from "@/components/clients/ClientTransactionDialog";
import { ClientInfoCard } from "@/components/clients/ClientInfoCard";
import { ClientTransactionHistory } from "@/components/clients/ClientTransactionHistory";
import { ClientActionsMenu } from "@/components/clients/ClientActionsMenu";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading, error } = useClient(id);
  const { deleteClient, updateClient } = useClients();
  const { data: transactions, refetch: refetchTransactions } = useTransactions({ clientId: id });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (!client) return;
    
    try {
      await deleteClient.mutateAsync(client.id);
      toast.success("Client supprimé avec succès");
      navigate("/clients");
    } catch (err) {
      toast.error(`Erreur lors de la suppression: ${(err as Error).message}`);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!client) return;
    
    try {
      await updateClient.mutateAsync({ id: client.id, ...data });
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

  const handleTransactionSuccess = () => {
    refetchTransactions();
    toast.success("Transaction ajoutée avec succès");
  };

  const handleServiceAction = () => {
    setIsTransactionDialogOpen(true);
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
              onClick={() => navigate("/clients")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Détails du Client</h1>
          </div>
          
          <ClientActionsMenu
            onNewTransaction={() => setIsTransactionDialogOpen(true)}
            onExportHistory={handleExportHistory}
            onRestaurantOrder={handleServiceAction}
            onBarOrder={handleServiceAction}
            onPokerTokens={handleServiceAction}
          />
        </div>

        <ClientInfoCard
          client={client}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />

        <ClientTransactionHistory
          transactions={transactions || []}
          handleExportHistory={handleExportHistory}
          onViewDetails={handleViewTransactionDetails}
        />
      </div>

      <TransactionDetailsSheet
        transaction={selectedTransaction}
        open={isTransactionSheetOpen}
        onOpenChange={setIsTransactionSheetOpen}
      />

      {client && (
        <ClientTransactionDialog
          open={isTransactionDialogOpen}
          onOpenChange={setIsTransactionDialogOpen}
          clientId={client.id}
          clientName={client.name}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </AppLayout>
  );
};

export default ClientDetails;
