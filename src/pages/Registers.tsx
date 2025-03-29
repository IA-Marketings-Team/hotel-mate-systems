
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Transaction, RegisterType } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { NewTransactionDialog } from "@/components/transactions/NewTransactionDialog";
import { toast } from "sonner";
import { RegisterTabs } from "@/components/registers/RegisterTabs";
import { RegisterSearch } from "@/components/registers/RegisterSearch";
import { RegisterContent } from "@/components/registers/RegisterContent";
import { useNavigate } from "react-router-dom";

const Registers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<RegisterType>("hotel");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

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

  const navigateToTransactionDetails = (transaction: Transaction) => {
    navigate(`/transaction/${transaction.id}`);
  };

  const handleTabChange = (value: RegisterType) => {
    setActiveTab(value);
  };

  const handleCreateInvoiceClick = () => {
    // Navigate to the invoices page with a state parameter that will trigger the creation dialog
    navigate("/invoices", { state: { openCreateDialog: true, registerType: activeTab } });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Caisses</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCreateInvoiceClick}>Créer une facture</Button>
          <Button onClick={() => setIsDialogOpen(true)}>Nouvelle transaction</Button>
        </div>
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
            onViewDetails={navigateToTransactionDetails}
          />
        </TabsContent>

        <TabsContent value="restaurant">
          <RegisterContent 
            registerType="restaurant"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={navigateToTransactionDetails}
          />
        </TabsContent>

        <TabsContent value="poker">
          <RegisterContent 
            registerType="poker"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={navigateToTransactionDetails}
          />
        </TabsContent>

        <TabsContent value="rooftop">
          <RegisterContent 
            registerType="rooftop"
            transactions={filteredTransactions} 
            isLoading={isLoading} 
            onViewDetails={navigateToTransactionDetails}
          />
        </TabsContent>
      </Tabs>

      <NewTransactionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        registerType={activeTab}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default Registers;
