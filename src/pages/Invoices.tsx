
import React, { useState } from "react";
import { useInvoices, Invoice } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { InvoicePaymentDialog } from "@/components/invoices/InvoicePaymentDialog";
import { useClients } from "@/hooks/useClients";
import { Search, Download, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InvoicePaymentData } from "@/types/invoice";

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string | undefined>(undefined);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  
  const navigate = useNavigate();
  
  const { data: invoices, isLoading, generateAndDownloadInvoice, processPayment } = useInvoices({ 
    status: statusFilter !== "all" ? statusFilter : undefined,
    clientId: clientFilter !== "all" ? clientFilter : undefined
  });
  const { data: clients, isLoading: isClientsLoading } = useClients();

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

  const handleOpenPaymentDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentDialogOpen(true);
  };

  const handleProcessPayment = async (paymentData: InvoicePaymentData) => {
    setIsSubmittingPayment(true);
    try {
      await processPayment.mutateAsync(paymentData);
      
      const paymentMessage = paymentData.amount >= (selectedInvoice?.remainingAmount || selectedInvoice?.amount || 0)
        ? "Facture marquée comme entièrement payée"
        : "Paiement partiel enregistré";
      
      toast.success(paymentMessage);
      setIsPaymentDialogOpen(false);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Erreur lors du traitement du paiement");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const viewTransactionDetails = (invoice: Invoice) => {
    navigate(`/transaction/${invoice.transactionId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Factures</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("/invoice/new")}>
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
            <SelectItem value="partially_paid">Partiellement payées</SelectItem>
            <SelectItem value="paid">Payées</SelectItem>
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
        <TabsList className="grid grid-cols-4 max-w-md">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="partially_paid">Partielles</TabsTrigger>
          <TabsTrigger value="paid">Payées</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DashboardCard title="Toutes les factures">
            <InvoiceTable 
              invoices={filteredInvoices} 
              isLoading={isLoading} 
              onDownload={handleGenerateInvoice}
              onPay={handleOpenPaymentDialog}
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
              onPay={handleOpenPaymentDialog}
              onViewDetails={viewTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="partially_paid">
          <DashboardCard title="Factures partiellement payées">
            <InvoiceTable 
              invoices={filteredInvoices.filter(inv => inv.status === 'partially_paid')}
              isLoading={isLoading} 
              onDownload={handleGenerateInvoice}
              onPay={handleOpenPaymentDialog}
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

      <InvoicePaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoice={selectedInvoice}
        onSubmit={handleProcessPayment}
        isSubmitting={isSubmittingPayment}
      />
    </div>
  );
};

export default Invoices;
