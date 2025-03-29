
import React from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface TransactionDetailsInfoProps {
  transaction: Transaction;
}

export const TransactionDetailsInfo: React.FC<TransactionDetailsInfoProps> = ({
  transaction
}) => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <p className="text-sm text-muted-foreground">Description</p>
        <p className="font-medium">{transaction.description}</p>
      </div>
      {transaction.category && (
        <div>
          <p className="text-sm text-muted-foreground">Catégorie</p>
          <p className="font-medium">{transaction.category}</p>
        </div>
      )}
      {transaction.subcategory && (
        <div>
          <p className="text-sm text-muted-foreground">Sous-catégorie</p>
          <p className="font-medium">{transaction.subcategory}</p>
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground">Montant</p>
        <p className={`font-medium text-2xl ${
          transaction.type === "payment" ? "text-green-600" : "text-red-600"
        }`}>
          {transaction.type === "payment" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};
