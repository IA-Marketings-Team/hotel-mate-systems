
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionGeneralInfo } from "@/components/transactions/TransactionGeneralInfo";
import { TransactionDetailsInfo } from "@/components/transactions/TransactionDetailsInfo";
import { TransactionActions } from "@/components/transactions/TransactionActions";
import { generateInvoicePDF, generateTransactionCSV } from "@/lib/pdfUtils";

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
