
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Transaction, RegisterType } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { NewTransactionDialog } from "@/components/transactions/NewTransactionDialog";
import { toast } from "sonner";
import { RegisterTabs } from "@/components/registers/RegisterTabs";
import { RegisterSearch } from "@/components/registers/RegisterSearch";
import { RegisterContent } from "@/components/registers/RegisterContent";
import { useNavigate, useLocation } from "react-router-dom";

interface PendingPayment {
  clientId: string;
  clientName: string;
  description: string;
  amount: number;
}

const Registers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<RegisterType>("hotel");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: transactions, isLoading, refetch } = useTransactions(activeTab);

  useEffect(() => {
    // Check if there's a pending payment in the location state
    const state = location.state as { pendingPayment?: PendingPayment } | null;
    if (state?.pendingPayment) {
      setPendingPayment(state.pendingPayment);
      setActiveTab("hotel"); // Set to hotel register for room bookings
      setIsDialogOpen(true);
      
      // Clear the location state to prevent showing the dialog on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

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
    setPendingPayment(null);
    toast.success(`La transaction a été ajoutée avec succès à la caisse ${activeTab}`);
  };

  const navigateToTransactionDetails = (transaction: Transaction) => {
    navigate(`/transaction/${transaction.id}`);
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
        clientId={pendingPayment?.clientId}
        initialDescription={pendingPayment?.description}
        initialAmount={pendingPayment?.amount}
      />
    </div>
  );
};

export default Registers;
