
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileCsv, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { toast } from "sonner";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AppLayout } from "@/components/layout/AppLayout";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw new Error(`Error fetching transaction: ${error.message}`);
      }
      
      // Transform the data to match the Transaction type
      return {
        id: data.id,
        date: data.date,
        amount: data.amount,
        type: data.type as 'payment' | 'refund',
        method: data.method as 'cash' | 'card' | 'transfer',
        registerType: data.register_type as 'hotel' | 'restaurant' | 'poker' | 'rooftop',
        description: data.description,
        staffId: data.staff_id,
        clientId: data.client_id,
        category: data.category,
        subcategory: data.subcategory
      } as Transaction;
    }
  });

  const goBack = () => {
    navigate("/registers");
  };

  const generateInvoice = () => {
    if (!transaction) return;
    
    try {
      const doc = new jsPDF();
      
      // Add logo or header
      doc.setFontSize(20);
      doc.text("FACTURE", 105, 20, { align: "center" });
      
      // Add invoice details
      doc.setFontSize(12);
      doc.text(`Numéro de transaction: ${transaction.id}`, 20, 40);
      doc.text(`Date: ${format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}`, 20, 50);
      doc.text(`Type: ${transaction.type === "payment" ? "Paiement" : "Remboursement"}`, 20, 60);
      doc.text(`Méthode: ${
        transaction.method === "cash" ? "Espèces" : 
        transaction.method === "card" ? "Carte" : "Virement"
      }`, 20, 70);
      
      // Add transaction details
      const tableColumn = ["Description", "Catégorie", "Sous-catégorie", "Montant"];
      const tableRows = [
        [
          transaction.description,
          transaction.category || "-",
          transaction.subcategory || "-",
          `${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`
        ]
      ];
      
      // @ts-ignore - jsPDF-AutoTable adds this method
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [66, 66, 66]
        }
      });
      
      // Add total
      doc.text(`Total: ${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`, 150, 130, { align: "right" });
      
      // Footer
      doc.setFontSize(10);
      doc.text("Merci pour votre confiance.", 105, 270, { align: "center" });
      
      // Save the PDF
      doc.save(`facture-${transaction.id}.pdf`);
      
      toast.success("La facture a été générée avec succès");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Impossible de générer la facture");
    }
  };

  const exportAsCSV = () => {
    if (!transaction) return;
    
    try {
      // Create CSV content
      const headers = "ID,Date,Type,Méthode,Description,Catégorie,Sous-catégorie,Montant\n";
      const formattedDate = format(new Date(transaction.date), "dd/MM/yyyy HH:mm");
      const type = transaction.type === "payment" ? "Paiement" : "Remboursement";
      const method = transaction.method === "cash" ? "Espèces" : 
                     transaction.method === "card" ? "Carte" : "Virement";
      const category = transaction.category || "-";
      const subcategory = transaction.subcategory || "-";
      const amount = `${transaction.type === "payment" ? "" : "-"}${transaction.amount}`;
      
      const row = `"${transaction.id}","${formattedDate}","${type}","${method}","${transaction.description}","${category}","${subcategory}","${amount}"\n`;
      const csvContent = headers + row;
      
      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `transaction-${transaction.id}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Le fichier CSV a été généré avec succès");
    } catch (error) {
      console.error("Error generating CSV:", error);
      toast.error("Impossible de générer le fichier CSV");
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-8 text-center">Chargement des détails de la transaction...</div>
      </AppLayout>
    );
  }

  if (!transaction) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-xl text-muted-foreground mb-4">Transaction non trouvée</p>
          <Button onClick={goBack}>Retour aux caisses</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Détails de la Transaction</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportAsCSV} className="flex items-center gap-2">
              <FileCsv className="h-4 w-4" />
              Exporter CSV
            </Button>
            <Button variant="outline" onClick={generateInvoice} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </div>

        <DashboardCard title="Informations générales">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className={`font-medium ${
                transaction.type === "payment" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.type === "payment" ? "Paiement" : "Remboursement"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Méthode</p>
              <p className="font-medium capitalize">
                {transaction.method === "cash" ? "Espèces" : 
                 transaction.method === "card" ? "Carte" : "Virement"}
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Détails">
          <div className="space-y-6 p-4">
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{transaction.description}</p>
            </div>
            {transaction.category && (
              <div>
                <p className="text-sm text-muted-foreground">Catégorie</p>
                <p className="font-medium">{transaction.category}</p>
              </div>
            )}
            {transaction.subcategory && (
              <div>
                <p className="text-sm text-muted-foreground">Sous-catégorie</p>
                <p className="font-medium">{transaction.subcategory}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Montant</p>
              <p className={`font-medium text-2xl ${
                transaction.type === "payment" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.type === "payment" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Actions">
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Téléchargez une copie de cette transaction dans différents formats pour vos archives ou pour la partager.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={generateInvoice} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Télécharger la facture PDF
              </Button>
              <Button variant="outline" onClick={exportAsCSV} className="flex items-center gap-2">
                <FileCsv className="h-4 w-4" />
                Télécharger CSV
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

export default TransactionDetails;
