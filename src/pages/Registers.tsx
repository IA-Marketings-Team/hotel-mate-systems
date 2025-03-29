
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Transaction, RegisterType } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { NewTransactionDialog } from "@/components/transactions/NewTransactionDialog";
import { TransactionDetailsSheet } from "@/components/transactions/TransactionDetailsSheet";
import { useToast } from "@/hooks/use-toast";
import { RegisterTabs } from "@/components/registers/RegisterTabs";
import { RegisterSearch } from "@/components/registers/RegisterSearch";
import { RegisterContent } from "@/components/registers/RegisterContent";

const Registers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<RegisterType>("hotel");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const { data: transactions, isLoading, refetch } = useTransactions(activeTab);

  const filteredTransactions = (transactions || []).filter((transaction) => {
    return (
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm) ||
      (transaction.category && transaction.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.subcategory && transaction.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleTransactionSuccess = () => {
    refetch();
    toast.success(`La transaction a été ajoutée avec succès à la caisse ${activeTab}`);
  };

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const handleTabChange = (value: RegisterType) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Caisses</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Nouvelle transaction</Button>
      </div>

      <Tabs defaultValue="hotel" value={activeTab} onValueChange={(value) => setActiveTab(value as RegisterType)}>
        <RegisterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <RegisterSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <TabsContent value="hotel">
          <RegisterContent 
            registerType="hotel"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={openTransactionDetails}
          />
        </TabsContent>

        <TabsContent value="restaurant">
          <RegisterContent 
            registerType="restaurant"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={openTransactionDetails}
          />
        </TabsContent>

        <TabsContent value="poker">
          <RegisterContent 
            registerType="poker"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={openTransactionDetails}
          />
        </TabsContent>

        <TabsContent value="rooftop">
          <RegisterContent 
            registerType="rooftop"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={openTransactionDetails}
          />
        </TabsContent>
      </Tabs>

      <NewTransactionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        registerType={activeTab}
        onSuccess={handleTransactionSuccess}
      />

      <TransactionDetailsSheet
        transaction={selectedTransaction}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default Registers;
