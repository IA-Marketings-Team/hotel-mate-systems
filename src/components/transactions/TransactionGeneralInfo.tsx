
import React from "react";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { UserIcon, UserCheck } from "lucide-react";

interface TransactionGeneralInfoProps {
  transaction: Transaction;
}

export const TransactionGeneralInfo: React.FC<TransactionGeneralInfoProps> = ({
  transaction
}) => {
  return (
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
      
      {transaction.clientName && (
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-blue-500" />
            <p className="text-sm text-muted-foreground">Client</p>
          </div>
          <p className="font-medium">{transaction.clientName}</p>
        </div>
      )}
      
      {transaction.staffName && (
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-green-500" />
            <p className="text-sm text-muted-foreground">Personnel</p>
          </div>
          <p className="font-medium">{transaction.staffName}</p>
        </div>
      )}
    </div>
  );
};
