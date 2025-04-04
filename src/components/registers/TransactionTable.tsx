
import React from "react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { MoreHorizontal, Plus, PlusCircle, UserIcon, UserCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

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
    } else if (type === "refund") {
      return <PlusCircle className="size-4 text-red-500" />;
    } else {
      return <Clock className="size-4 text-amber-500" />;
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
          <TableHead>Client</TableHead>
          <TableHead>Personnel</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow 
            key={transaction.id} 
            className={`cursor-pointer hover:bg-muted/80 ${transaction.type === 'pending' ? 'bg-amber-50' : ''}`} 
            onClick={() => onViewDetails(transaction)}
          >
            <TableCell>{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</TableCell>
            <TableCell className="font-medium">{transaction.description}</TableCell>
            <TableCell>
              {transaction.category} 
              {transaction.subcategory && <span className="text-muted-foreground ml-1">/ {transaction.subcategory}</span>}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {getTransactionIcon(transaction.type)}
                <span>
                  {transaction.type === "payment" ? "Paiement" : 
                   transaction.type === "refund" ? "Remboursement" : 
                   "À payer plus tard"}
                </span>
              </div>
            </TableCell>
            <TableCell className="capitalize">
              {transaction.method === "cash" ? "Espèces" : 
                transaction.method === "card" ? "Carte" : "Virement"}
            </TableCell>
            <TableCell>
              {transaction.clientName ? (
                <div className="flex items-center gap-1">
                  <UserIcon className="size-3 text-blue-500" />
                  <span>{transaction.clientName}</span>
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {transaction.staffName ? (
                <div className="flex items-center gap-1">
                  <UserCheck className="size-3 text-green-500" />
                  <span>{transaction.staffName}</span>
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className={`text-right font-medium ${
              transaction.type === "payment" ? "text-green-600" : 
              transaction.type === "refund" ? "text-red-600" : 
              "text-amber-600"
            }`}>
              {transaction.type === "payment" ? "+" : 
               transaction.type === "refund" ? "-" :
               "⏱ "}
              {formatCurrency(transaction.amount)}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
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
