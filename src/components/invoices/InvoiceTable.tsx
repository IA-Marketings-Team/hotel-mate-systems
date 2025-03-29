
import React from "react";
import { Invoice } from "@/hooks/useInvoices";
import { format } from "date-fns";
import { Calendar, Download, MoreHorizontal, CheckCircle, Clock, XCircle, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onDownload: (invoice: Invoice) => void;
  onViewDetails: (invoice: Invoice) => void;
}

export function InvoiceTable({ 
  invoices, 
  isLoading, 
  onDownload,
  onViewDetails
}: InvoiceTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Payée
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement des factures...</div>;
  }

  if (!invoices.length) {
    return <div className="text-center py-8 text-muted-foreground">Aucune facture trouvée</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numéro</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow 
            key={invoice.id} 
            className={`cursor-pointer hover:bg-muted/80 ${invoice.status === 'pending' ? 'bg-amber-50' : ''}`}
            onClick={() => onViewDetails(invoice)}
          >
            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>{format(new Date(invoice.date), "dd/MM/yyyy")}</span>
              </div>
            </TableCell>
            <TableCell>{invoice.clientName || "Client non spécifié"}</TableCell>
            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
            <TableCell className="text-right font-medium">
              <div className="flex items-center justify-end gap-1">
                <Euro className="h-3 w-3 text-muted-foreground" />
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(invoice)}>
                    Voir les détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(invoice)}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger la facture
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
