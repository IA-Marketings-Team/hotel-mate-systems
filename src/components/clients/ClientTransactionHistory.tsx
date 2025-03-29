
import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Transaction } from "@/types";
import { TransactionTable } from "@/components/registers/TransactionTable";

interface ClientTransactionHistoryProps {
  transactions: Transaction[];
  handleExportHistory: () => void;
  onViewDetails: (transaction: Transaction) => void;
}

export const ClientTransactionHistory = ({
  transactions,
  handleExportHistory,
  onViewDetails
}: ClientTransactionHistoryProps) => {
  return (
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
            onViewDetails={onViewDetails}
          />
        )}
      </div>
    </DashboardCard>
  );
};
