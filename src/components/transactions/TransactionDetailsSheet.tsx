
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, UserCheck, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { generateInvoicePDF } from "@/lib/pdfUtils";

interface TransactionDetailsSheetProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsSheet({ 
  transaction, 
  open, 
  onOpenChange 
}: TransactionDetailsSheetProps) {
  if (!transaction) return null;

  const generateInvoice = () => {
    try {
      generateInvoicePDF(transaction);
      toast.success("La facture a été générée avec succès");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Impossible de générer la facture");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Détails de la Transaction</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Informations générales</h3>
            <Button variant="outline" size="sm" onClick={generateInvoice} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Télécharger la facture
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID</p>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</p>
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

          {(transaction.clientName || transaction.staffName) && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Personnes</h3>
              <div className="space-y-3">
                {transaction.clientName && (
                  <div className="flex items-start gap-2">
                    <UserIcon className="h-4 w-4 mt-0.5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">{transaction.clientName}</p>
                    </div>
                  </div>
                )}
                
                {transaction.staffName && (
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-4 w-4 mt-0.5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Personnel</p>
                      <p className="font-medium">{transaction.staffName}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Détails</h3>
            <div className="space-y-3">
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
                <p className={`font-medium text-xl ${
                  transaction.type === "payment" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "payment" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
