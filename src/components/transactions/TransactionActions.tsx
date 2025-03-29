
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";

interface TransactionActionsProps {
  onGenerateInvoice: () => void;
  onExportCSV: () => void;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
  onGenerateInvoice,
  onExportCSV
}) => {
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Téléchargez une copie de cette transaction dans différents formats pour vos archives ou pour la partager.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onGenerateInvoice} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Télécharger la facture PDF
        </Button>
        <Button variant="outline" onClick={onExportCSV} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Télécharger CSV
        </Button>
      </div>
    </div>
  );
};
