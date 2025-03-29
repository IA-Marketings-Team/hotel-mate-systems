
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Transaction, RegisterType } from "@/types";
import { Search, Plus, PlusCircle, Hotel, Utensils, CircleDollarSign, Umbrella, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { useTransactions } from "@/hooks/useTransactions";
import { NewTransactionDialog } from "@/components/transactions/NewTransactionDialog";
import { TransactionDetailsSheet } from "@/components/transactions/TransactionDetailsSheet";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const Registers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<RegisterType>("hotel");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const { data: transactions, isLoading, refetch } = useTransactions(activeTab);

  const getTransactionIcon = (type: string) => {
    if (type === "payment") {
      return <Plus className="size-4 text-green-500" />;
    } else {
      return <PlusCircle className="size-4 text-red-500" />;
    }
  };

  const getRegisterIcon = (registerType: RegisterType) => {
    switch (registerType) {
      case "hotel":
        return <Hotel className="size-5" />;
      case "restaurant":
        return <Utensils className="size-5" />;
      case "poker":
        return <CircleDollarSign className="size-5" />;
      case "rooftop":
        return <Umbrella className="size-5" />;
      default:
        return null;
    }
  };

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
    toast({
      title: "Transaction ajoutée",
      description: "La transaction a été ajoutée avec succès à la caisse " + activeTab
    });
  };

  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Caisses</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Nouvelle transaction</Button>
      </div>

      <Tabs defaultValue="hotel" onValueChange={(value) => setActiveTab(value as RegisterType)}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="hotel" className="flex items-center gap-2">
            <Hotel className="size-4" />
            <span>Hôtellerie</span>
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="flex items-center gap-2">
            <Utensils className="size-4" />
            <span>Restaurant</span>
          </TabsTrigger>
          <TabsTrigger value="poker" className="flex items-center gap-2">
            <CircleDollarSign className="size-4" />
            <span>Poker</span>
          </TabsTrigger>
          <TabsTrigger value="rooftop" className="flex items-center gap-2">
            <Umbrella className="size-4" />
            <span>Rooftop</span>
          </TabsTrigger>
        </TabsList>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher des transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value="hotel" className="space-y-4">
          <DashboardCard title="Caisse Hôtellerie">
            <RegisterContent 
              transactions={filteredTransactions} 
              isLoading={isLoading} 
              getTransactionIcon={getTransactionIcon}
              onViewDetails={openTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-4">
          <DashboardCard title="Caisse Restaurant">
            <RegisterContent 
              transactions={filteredTransactions} 
              isLoading={isLoading} 
              getTransactionIcon={getTransactionIcon}
              onViewDetails={openTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="poker" className="space-y-4">
          <DashboardCard title="Caisse Poker">
            <RegisterContent 
              transactions={filteredTransactions} 
              isLoading={isLoading} 
              getTransactionIcon={getTransactionIcon}
              onViewDetails={openTransactionDetails}
            />
          </DashboardCard>
        </TabsContent>

        <TabsContent value="rooftop" className="space-y-4">
          <DashboardCard title="Caisse Rooftop">
            <RegisterContent 
              transactions={filteredTransactions} 
              isLoading={isLoading} 
              getTransactionIcon={getTransactionIcon}
              onViewDetails={openTransactionDetails}
            />
          </DashboardCard>
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

interface RegisterContentProps {
  transactions: Transaction[];
  isLoading: boolean;
  getTransactionIcon: (type: string) => JSX.Element;
  onViewDetails: (transaction: Transaction) => void;
}

const RegisterContent = ({ 
  transactions, 
  isLoading, 
  getTransactionIcon,
  onViewDetails 
}: RegisterContentProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Chargement des transactions...</div>;
  }

  if (!transactions.length) {
    return <div className="text-center py-8 text-muted-foreground">Aucune transaction trouvée</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground [&_th]:py-3 [&_th]:pr-4">
            <th>Date</th>
            <th>Description</th>
            <th>Catégorie</th>
            <th>Type</th>
            <th>Méthode</th>
            <th className="text-right">Montant</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-muted [&_td]:py-3 [&_td]:pr-4">
              <td>{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</td>
              <td className="font-medium">{transaction.description}</td>
              <td>
                {transaction.category} 
                {transaction.subcategory && <span className="text-muted-foreground ml-1">/ {transaction.subcategory}</span>}
              </td>
              <td>
                <div className="flex items-center gap-1">
                  {getTransactionIcon(transaction.type)}
                  <span>{transaction.type === "payment" ? "Paiement" : "Remboursement"}</span>
                </div>
              </td>
              <td className="capitalize">{transaction.method}</td>
              <td className={`text-right font-medium ${
                transaction.type === "payment" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.type === "payment" ? "+" : "-"}
                {transaction.amount} €
              </td>
              <td>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(transaction)}>
                      Voir les détails
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Registers;
