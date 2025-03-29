
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileSpreadsheet, FileText } from "lucide-react";

interface TransactionHeaderProps {
  title: string;
  onGoBack: () => void;
  onExportCSV: () => void;
  onGenerateInvoice: () => void;
}

export const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  title,
  onGoBack,
  onExportCSV,
  onGenerateInvoice
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportCSV} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exporter CSV
        </Button>
        <Button variant="outline" onClick={onGenerateInvoice} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Exporter PDF
        </Button>
      </div>
    </div>
  );
};
