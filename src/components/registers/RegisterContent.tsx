
import React from "react";
import { Transaction, RegisterType } from "@/types";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TransactionTable } from "./TransactionTable";

interface RegisterContentProps {
  registerType: RegisterType;
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails: (transaction: Transaction) => void;
}

export function RegisterContent({ 
  registerType, 
  transactions, 
  isLoading, 
  onViewDetails 
}: RegisterContentProps) {
  const getRegisterTitle = (type: RegisterType) => {
    switch (type) {
      case "hotel":
        return "Caisse Hôtellerie";
      case "restaurant":
        return "Caisse Restaurant";
      case "poker":
        return "Caisse Poker";
      case "rooftop":
        return "Caisse Rooftop";
      default:
        return "Caisse";
    }
  };

  return (
    <DashboardCard title={getRegisterTitle(registerType)}>
      <TransactionTable 
        transactions={transactions}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
      />
    </DashboardCard>
  );
}
