
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Pencil, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface TransactionActionsProps {
  onGenerateInvoice: () => void;
  onExportCSV: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
  onGenerateInvoice,
  onExportCSV,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    await onDelete();
    navigate('/registers');
  };

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-muted-foreground">
        Téléchargez une copie de cette transaction dans différents formats pour vos archives ou pour la partager.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={onGenerateInvoice} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Télécharger la facture PDF
        </Button>
        <Button variant="outline" onClick={onExportCSV} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Télécharger CSV
        </Button>
        <Button variant="secondary" onClick={onEdit} className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Modifier
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="flex items-center gap-2" disabled={isDeleting}>
          <Trash2 className="h-4 w-4" />
          Supprimer
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cette transaction sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
