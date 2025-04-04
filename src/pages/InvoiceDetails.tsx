
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices, Invoice } from "@/hooks/useInvoices";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, CreditCard, FileText, User, CalendarDays, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { InvoicePaymentDialog } from "@/components/invoices/InvoicePaymentDialog";
import { InvoicePaymentData } from "@/types/invoice";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: invoices, isLoading, generateAndDownloadInvoice, processPayment, cancelInvoice } = useInvoices();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  useEffect(() => {
    if (invoices && id) {
      const foundInvoice = invoices.find(inv => inv.id === id);
      setInvoice(foundInvoice || null);
    }
  }, [invoices, id]);

  const handleDownload = async () => {
    if (invoice) {
      try {
        await generateAndDownloadInvoice(invoice);
      } catch (error) {
        console.error("Error downloading invoice:", error);
        toast.error("Erreur lors du téléchargement de la facture");
      }
    }
  };

  const handleProcessPayment = async (paymentData: InvoicePaymentData) => {
    setIsSubmittingPayment(true);
    try {
      await processPayment.mutateAsync(paymentData);
      
      const paymentMessage = paymentData.amount >= (invoice?.remainingAmount || invoice?.amount || 0)
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

  const handleCancel = async () => {
    if (invoice) {
      try {
        await cancelInvoice.mutateAsync(invoice.id);
        toast.success("Facture annulée");
      } catch (error) {
        console.error("Error canceling invoice:", error);
        toast.error("Erreur lors de l'annulation de la facture");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 text-white">Payée</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">En attente</Badge>;
      case "partially_paid":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Partiellement payée</Badge>;
      case "overdue":
        return <Badge variant="destructive">En retard</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de la facture...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!invoice) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Facture introuvable</h2>
          <p className="text-muted-foreground mb-6">La facture que vous recherchez n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux factures
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux factures
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
            {(invoice.status === "pending" || invoice.status === "partially_paid") && (
              <>
                <Button onClick={() => setIsPaymentDialogOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {invoice.status === "partially_paid" ? "Compléter le paiement" : "Enregistrer le paiement"}
                </Button>
                <Button variant="destructive" onClick={handleCancel}>
                  Annuler
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-8 border">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <FileText className="mr-2 h-6 w-6 text-blue-500" />
                {invoice.invoiceNumber}
              </h1>
              <div className="flex items-center mt-2">
                <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Créée le {format(new Date(invoice.date), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              {getStatusBadge(invoice.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Détails</h3>
              
              <div className="border rounded-md p-4 space-y-2 bg-white">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID de transaction</span>
                  <span className="font-mono">{invoice.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date de facture</span>
                  <span>{format(new Date(invoice.date), "dd/MM/yyyy", { locale: fr })}</span>
                </div>
                {invoice.dueDate && (invoice.status === "pending" || invoice.status === "partially_paid") && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'échéance</span>
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-1 text-amber-500" />
                      <span>{format(new Date(invoice.dueDate), "dd/MM/yyyy", { locale: fr })}</span>
                    </div>
                  </div>
                )}
              </div>

              {invoice.clientName && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Client</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      <span className="font-medium">{invoice.clientName}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Montant</h3>
              
              <div className="border rounded-md p-6 flex flex-col items-center justify-center bg-white">
                <span className="text-4xl font-bold text-gray-900">{formatCurrency(invoice.amount)}</span>
                
                {invoice.status === "partially_paid" && (
                  <div className="mt-2 w-full space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Payé:</span>
                      <span className="font-medium text-green-600">{formatCurrency(invoice.paidAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reste à payer:</span>
                      <span className="font-medium text-amber-600">{formatCurrency(invoice.remainingAmount || 0)}</span>
                    </div>
                  </div>
                )}
                
                {invoice.status === "pending" && (
                  <span className="text-sm text-amber-500 mt-2">En attente de paiement</span>
                )}
                {invoice.status === "paid" && (
                  <span className="text-sm text-green-500 mt-2">Payé</span>
                )}
              </div>

              {(invoice.status === "pending" || invoice.status === "partially_paid") && (
                <div className="mt-6">
                  <Button className="w-full" onClick={() => setIsPaymentDialogOpen(true)}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {invoice.status === "partially_paid" ? "Compléter le paiement" : "Enregistrer le paiement"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <InvoicePaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        invoice={invoice}
        onSubmit={handleProcessPayment}
        isSubmitting={isSubmittingPayment}
      />
    </AppLayout>
  );
};

export default InvoiceDetails;
