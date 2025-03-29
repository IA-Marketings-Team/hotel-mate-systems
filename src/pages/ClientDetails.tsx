
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useClient } from "@/hooks/useClients";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { TransactionTable } from "@/components/registers/TransactionTable";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading, error, deleteClient } = useClient(id);
  const { data: transactions } = useTransactions();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">Chargement des informations client...</div>
      </AppLayout>
    );
  }

  if (error || !client) {
    return (
      <AppLayout>
        <div className="p-6 text-red-500">
          Une erreur est survenue: {(error as Error)?.message || "Client introuvable"}
        </div>
      </AppLayout>
    );
  }

  // Filter transactions for this client
  const clientTransactions = transactions?.filter(t => t.clientId === id) || [];
  
  // Filter by type based on active tab
  const filteredTransactions = clientTransactions.filter(transaction => {
    if (activeTab === "all") return true;
    if (activeTab === "hotel") return transaction.registerType === "hotel";
    if (activeTab === "restaurant") return transaction.registerType === "restaurant";
    if (activeTab === "bookings") return transaction.category === "reservation";
    return true;
  });

  const handleDelete = async () => {
    try {
      await deleteClient.mutateAsync(id);
      toast.success("Client supprimé avec succès");
      navigate("/clients");
    } catch (err) {
      toast.error(`Erreur lors de la suppression: ${(err as Error).message}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/clients")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{client.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/client/edit/${id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <DashboardCard title="Informations Client">
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-4">Coordonnées</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <span>{client.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Téléphone:</span>{" "}
                  <span>{client.phone}</span>
                </div>
                {client.address && (
                  <div>
                    <span className="text-muted-foreground">Adresse:</span>{" "}
                    <div className="pl-4 mt-1">
                      <div>{client.address}</div>
                      {client.postalCode && client.city && (
                        <div>{client.postalCode} {client.city}</div>
                      )}
                      {client.country && <div>{client.country}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-4">Informations supplémentaires</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Date de création:</span>{" "}
                  <span>{client.createdAt && format(new Date(client.createdAt), "dd/MM/yyyy")}</span>
                </div>
                {client.notes && (
                  <div>
                    <span className="text-muted-foreground">Notes:</span>{" "}
                    <div className="pl-4 mt-1">{client.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Historique des Transactions">
          <div className="p-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="hotel">Hôtel</TabsTrigger>
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                <TabsTrigger value="bookings">Réservations</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-0">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Aucune transaction trouvée
                  </div>
                ) : (
                  <TransactionTable transactions={filteredTransactions} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DashboardCard>
      </div>

      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Ce client sera définitivement supprimé de notre base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default ClientDetails;
