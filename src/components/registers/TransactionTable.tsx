
import React from "react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { MoreHorizontal, Plus, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails: (transaction: Transaction) => void;
}

export function TransactionTable({ 
  transactions, 
  isLoading, 
  onViewDetails 
}: TransactionTableProps) {
  const getTransactionIcon = (type: string) => {
    if (type === "payment") {
      return <Plus className="size-4 text-green-500" />;
    } else {
      return <PlusCircle className="size-4 text-red-500" />;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des transactions...</div>;
  }

  if (!transactions.length) {
    return <div className="text-center py-8 text-muted-foreground">Aucune transaction trouvée</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Méthode</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</TableCell>
            <TableCell className="font-medium">{transaction.description}</TableCell>
            <TableCell>
              {transaction.category} 
              {transaction.subcategory && <span className="text-muted-foreground ml-1">/ {transaction.subcategory}</span>}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {getTransactionIcon(transaction.type)}
                <span>{transaction.type === "payment" ? "Paiement" : "Remboursement"}</span>
              </div>
            </TableCell>
            <TableCell className="capitalize">{transaction.method}</TableCell>
            <TableCell className={`text-right font-medium ${
              transaction.type === "payment" ? "text-green-600" : "text-red-600"
            }`}>
              {transaction.type === "payment" ? "+" : "-"}
              {transaction.amount} €
            </TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
