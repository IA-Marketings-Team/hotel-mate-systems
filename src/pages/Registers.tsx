
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockTransactions } from "@/lib/mock-data";
import { Transaction } from "@/types";
import { Search, Plus, PlusCircle, Hotel, Utensils, CircleDollarSign } from "lucide-react";
import { format } from "date-fns";

const Registers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("hotel");

  const getTransactionIcon = (type: string) => {
    if (type === "payment") {
      return <Plus className="size-4 text-green-500" />;
    } else {
      return <PlusCircle className="size-4 text-red-500" />;
    }
  };

  const getRegisterIcon = (registerType: string) => {
    switch (registerType) {
      case "hotel":
        return <Hotel className="size-5" />;
      case "restaurant":
        return <Utensils className="size-5" />;
      case "poker":
        return <CircleDollarSign className="size-5" />;
      default:
        return null;
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    return (
      transaction.registerType === activeTab &&
      (transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Caisses</h1>
        <Button>Nouvelle transaction</Button>
      </div>

      <Tabs defaultValue="hotel" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground [&_th]:py-3 [&_th]:pr-4">
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Méthode</th>
                    <th className="text-right">Montant</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-muted [&_td]:py-3 [&_td]:pr-4">
                      <td>{format(transaction.date, "dd/MM/yyyy HH:mm")}</td>
                      <td className="font-medium">{transaction.description}</td>
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
                        <Button variant="ghost" size="sm">Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-4">
          <DashboardCard title="Caisse Restaurant">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground [&_th]:py-3 [&_th]:pr-4">
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Méthode</th>
                    <th className="text-right">Montant</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-muted [&_td]:py-3 [&_td]:pr-4">
                      <td>{format(transaction.date, "dd/MM/yyyy HH:mm")}</td>
                      <td className="font-medium">{transaction.description}</td>
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
                        <Button variant="ghost" size="sm">Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="poker" className="space-y-4">
          <DashboardCard title="Caisse Poker">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground [&_th]:py-3 [&_th]:pr-4">
                    <th>Date</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>Méthode</th>
                    <th className="text-right">Montant</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-muted [&_td]:py-3 [&_td]:pr-4">
                      <td>{format(transaction.date, "dd/MM/yyyy HH:mm")}</td>
                      <td className="font-medium">{transaction.description}</td>
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
                        <Button variant="ghost" size="sm">Détails</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Registers;
