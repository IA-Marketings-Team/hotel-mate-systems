import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

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
  const { toast } = useToast();

  if (!transaction) return null;

  const generateInvoice = () => {
    try {
      const doc = new jsPDF();
      
      // Add logo or header
      doc.setFontSize(20);
      doc.text("FACTURE", 105, 20, { align: "center" });
      
      // Add invoice details
      doc.setFontSize(12);
      doc.text(`Numéro de transaction: ${transaction.id}`, 20, 40);
      doc.text(`Date: ${format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}`, 20, 50);
      doc.text(`Type: ${transaction.type === "payment" ? "Paiement" : "Remboursement"}`, 20, 60);
      doc.text(`Méthode: ${
        transaction.method === "cash" ? "Espèces" : 
        transaction.method === "card" ? "Carte" : "Virement"
      }`, 20, 70);
      
      // Add transaction details
      const tableColumn = ["Description", "Catégorie", "Sous-catégorie", "Montant"];
      const tableRows = [
        [
          transaction.description,
          transaction.category || "-",
          transaction.subcategory || "-",
          `${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`
        ]
      ];
      
      // @ts-ignore
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [66, 66, 66]
        }
      });
      
      // Add total
      doc.text(`Total: ${transaction.type === "payment" ? "+" : "-"}${formatCurrency(transaction.amount)}`, 150, 130, { align: "right" });
      
      // Footer
      doc.setFontSize(10);
      doc.text("Merci pour votre confiance.", 105, 270, { align: "center" });
      
      // Save the PDF
      doc.save(`facture-${transaction.id}.pdf`);
      
      toast("Facture téléchargée", {
        description: "La facture a été générée avec succès"
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast("Erreur", {
        description: "Impossible de générer la facture",
        variant: "destructive"
      });
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

          <div>
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
