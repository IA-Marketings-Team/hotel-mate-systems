
import React, { useState, useEffect } from "react";
import { useInvoices, Invoice } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { useClients } from "@/hooks/useClients";
import { Search, Download, FileText, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { NewTransactionDialog } from "@/components/transactions/NewTransactionDialog";
import { RegisterType } from "@/types";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string | undefined>(undefined);
  const [isNewInvoiceDialogOpen, setIsNewInvoiceDialogOpen] = useState(false);
  const [registerType, setRegisterType] = useState<RegisterType>("hotel");
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: invoices, isLoading, generateAndDownloadInvoice, markAsPaid } = useInvoices({ 
    status: statusFilter !== "all" ? statusFilter : undefined,
    clientId: clientFilter !== "all" ? clientFilter : undefined
  });
  const { data: clients, isLoading: isClientsLoading } = useClients();

  // Check if we should open the invoice creation dialog from navigation state
  useEffect(() => {
    const state = location.state as { openCreateDialog?: boolean; registerType?: RegisterType } | null;
    
    if (state?.openCreateDialog) {
      if (state.registerType) {
        setRegisterType(state.registerType);
      }
      setIsNewInvoiceDialogOpen(true);
      
      // Clear the location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const filteredInvoices = (invoices || []).filter((invoice) => {
    const searchInvoice = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.clientName && invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.amount.toString().includes(searchTerm);
    
    return searchInvoice;
  });

  const handleGenerateInvoice = async (invoice: Invoice) => {
    try {
      await generateAndDownloadInvoice(invoice);
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      await markAsPaid.mutateAsync(invoice.id);
      toast.success("Facture marquée comme payée");
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Erreur lors du paiement de la facture");
    }
  };

  const viewTransactionDetails = (invoice: Invoice) => {
    navigate(`/transaction/${invoice.transactionId}`);
  };

  const handleNewInvoiceSuccess = () => {
    setIsNewInvoiceDialogOpen(false);
    toast.success("Facture créée avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Factures</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsNewInvoiceDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {filteredInvoices.length} facture{filteredInvoices.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une facture..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="paid">Payée</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={clientFilter}
          onValueChange={setClientFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les clients</SelectItem>
            {clients?.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => {
          const downloadAllPromises = filteredInvoices.map(invoice => generateAndDownloadInvoice(invoice));
          Promise.all(downloadAllPromises)
            .then(() => toast.success("Toutes les factures ont été téléchargées"))
            .catch(() => toast.error("Erreur lors du téléchargement des factures"));
        }}>
          <Download className="mr-2 h-4 w-4" />
          Tout télécharger
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="paid">Payées</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DashboardCard title="Toutes les factures">
            <InvoiceTable 
              invoices={filteredInvoices} 
              isLoading={isLoading} 
              onDownload={handleGenerateInvoice}
              onPay={handleMarkAsPaid}
              onViewDetails={viewTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="pending">
          <DashboardCard title="Factures en attente">
            <InvoiceTable 
              invoices={filteredInvoices.filter(inv => inv.status === 'pending')}
              isLoading={isLoading} 
              onDownload={handleGenerateInvoice}
              onPay={handleMarkAsPaid}
              onViewDetails={viewTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="paid">
          <DashboardCard title="Factures payées">
            <InvoiceTable 
              invoices={filteredInvoices.filter(inv => inv.status === 'paid')} 
              isLoading={isLoading} 
              onDownload={handleGenerateInvoice}
              onViewDetails={viewTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>
      </Tabs>

      <NewTransactionDialog 
        open={isNewInvoiceDialogOpen} 
        onOpenChange={setIsNewInvoiceDialogOpen} 
        registerType={registerType}
        onSuccess={handleNewInvoiceSuccess}
        initialType="pending"
      />
    </div>
  );
};

export default Invoices;
