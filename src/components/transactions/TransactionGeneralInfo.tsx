
import React from "react";
import { format } from "date-fns";
import { Transaction } from "@/types";

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
    </div>
  );
};
