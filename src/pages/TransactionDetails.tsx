
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionGeneralInfo } from "@/components/transactions/TransactionGeneralInfo";
import { TransactionDetailsInfo } from "@/components/transactions/TransactionDetailsInfo";
import { TransactionActions } from "@/components/transactions/TransactionActions";
import { generateInvoicePDF, generateTransactionCSV } from "@/lib/pdfUtils";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { TransactionLoading } from "@/components/transactions/TransactionLoading";
import { TransactionError } from "@/components/transactions/TransactionError";

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: transaction, isLoading, error } = useTransactionDetails(id);

  const goBack = () => {
    navigate("/registers");
  };

  const generateInvoice = () => {
    if (!transaction) return;
    
    try {
      const filename = generateInvoicePDF(transaction);
      toast.success("La facture a été générée avec succès");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Impossible de générer la facture");
    }
  };

  const exportAsCSV = () => {
    if (!transaction) return;
    
    try {
      const filename = generateTransactionCSV(transaction);
      toast.success("Le fichier CSV a été généré avec succès");
    } catch (error) {
      console.error("Error generating CSV:", error);
      toast.error("Impossible de générer le fichier CSV");
    }
  };

  if (isLoading) {
    return <TransactionLoading />;
  }

  if (error || !transaction) {
    return (
      <TransactionError 
        message={error ? `Erreur: ${error.message}` : "Transaction non trouvée"} 
        onGoBack={goBack}
      />
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <TransactionHeader 
          title="Détails de la Transaction"
          onGoBack={goBack}
          onExportCSV={exportAsCSV}
          onGenerateInvoice={generateInvoice}
        />

        <DashboardCard title="Informations générales">
          <TransactionGeneralInfo transaction={transaction} />
        </DashboardCard>

        <DashboardCard title="Détails">
          <TransactionDetailsInfo transaction={transaction} />
        </DashboardCard>

        <DashboardCard title="Actions">
          <TransactionActions 
            onGenerateInvoice={generateInvoice}
            onExportCSV={exportAsCSV}
          />
        </DashboardCard>
      </div>
    </AppLayout>
  );
};

export default TransactionDetails;
