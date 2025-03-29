
import React from "react";
import { format } from "date-fns";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Transaction, RegisterType } from "@/types";
import { 
  FileDown, 
  Receipt, 
  Hotel, 
  Utensils, 
  CircleDollarSign, 
  Umbrella,
  Calendar,
  CreditCard,
  User,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const getRegisterIcon = (registerType: RegisterType) => {
    switch (registerType) {
      case "hotel":
        return <Hotel className="size-5" />;
      case "restaurant":
        return <Utensils className="size-5" />;
      case "poker":
        return <CircleDollarSign className="size-5" />;
      case "rooftop":
        return <Umbrella className="size-5" />;
    }
  };

  const downloadInvoice = () => {
    // Create simple invoice data
    const invoiceData = {
      number: `INV-${transaction.id.substring(0, 8)}`,
      date: format(new Date(transaction.date), "dd/MM/yyyy"),
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      method: transaction.method,
      registerType: transaction.registerType,
      category: transaction.category || "Non catégorisé",
      subcategory: transaction.subcategory || "Non catégorisé",
    };
    
    // Create a blob with invoice content
    const invoiceContent = `
      FACTURE #${invoiceData.number}
      Date: ${invoiceData.date}
      
      Type de transaction: ${transaction.type === "payment" ? "Paiement" : "Remboursement"}
      Méthode: ${transaction.method}
      Caisse: ${transaction.registerType}
      
      Description: ${transaction.description}
      Catégorie: ${transaction.category || "Non catégorisé"}
      Sous-catégorie: ${transaction.subcategory || "Non catégorisé"}
      
      Montant: ${transaction.type === "payment" ? "+" : "-"}${transaction.amount} €
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${invoiceData.number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Receipt className="size-5" />
            <span>Détails de la transaction</span>
          </SheetTitle>
          <SheetDescription>
            Informations détaillées sur la transaction du {format(new Date(transaction.date), "dd/MM/yyyy à HH:mm")}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="flex items-center gap-2">
              {getRegisterIcon(transaction.registerType)}
              <span className="capitalize font-medium">{transaction.registerType}</span>
            </div>
            <Badge variant={transaction.type === "payment" ? "success" : "destructive"}>
              {transaction.type === "payment" ? "Paiement" : "Remboursement"}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Informations générales</h3>
            
            <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-3 items-center">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}</p>
              </div>
              
              <CreditCard className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Méthode de paiement</p>
                <p className="text-sm text-muted-foreground capitalize">{transaction.method}</p>
              </div>
              
              {transaction.staffId && (
                <>
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Personnel</p>
                    <p className="text-sm text-muted-foreground">{transaction.staffId}</p>
                  </div>
                </>
              )}
              
              {transaction.clientId && (
                <>
                  <User className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">{transaction.clientId}</p>
                  </div>
                </>
              )}
              
              {(transaction.category || transaction.subcategory) && (
                <>
                  <Tag className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Catégorie</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category || "Non catégorisé"}
                      {transaction.subcategory && ` / ${transaction.subcategory}`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Montant</h3>
            <p className={`text-xl font-bold ${
              transaction.type === "payment" ? "text-green-600" : "text-red-600"
            }`}>
              {transaction.type === "payment" ? "+" : "-"}{transaction.amount} €
            </p>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button 
            onClick={downloadInvoice}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <FileDown className="size-4" />
            <span>Télécharger la facture</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
