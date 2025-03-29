
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, AlertCircle, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Invoice } from "@/hooks/useInvoices";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onDownload: (invoice: Invoice) => void;
  onPay?: (invoice: Invoice) => void;
  onViewDetails: (invoice: Invoice) => void;
}

export function InvoiceTable({ invoices, isLoading, onDownload, onPay, onViewDetails }: InvoiceTableProps) {
  if (isLoading) {
    return <LoadingSkeletons />;
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune facture trouvée</h3>
        <p className="text-muted-foreground mt-2">
          Il n'y a pas de factures correspondant à vos critères de recherche.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Payée</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">En attente</Badge>;
      case "overdue":
        return <Badge variant="destructive">En retard</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numéro</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>{format(new Date(invoice.date), "dd MMM yyyy", { locale: fr })}</TableCell>
              <TableCell>{invoice.clientName || "—"}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewDetails(invoice)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDownload(invoice)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  {invoice.status === "pending" && onPay && (
                    <Button variant="ghost" size="icon" onClick={() => onPay(invoice)}>
                      <CreditCard className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LoadingSkeletons() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[120px]" />
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[100px] ml-auto" />
        </div>
      ))}
    </div>
  );
}
