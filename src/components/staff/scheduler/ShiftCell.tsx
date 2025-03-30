
import React from "react";
import { Shift } from "@/hooks/useShiftCrud";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TasksInSchedule } from "./TasksInSchedule";
import { ShiftTasksLink } from "./ShiftTasksLink";

interface ShiftCellProps {
  shift: Shift;
  onEdit: (shift: Shift) => void;
  onDelete: (id: string) => void;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  shift,
  onEdit,
  onDelete,
}) => {
  const getShiftColor = (type: string) => {
    switch(type) {
      case 'morning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'afternoon':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'night':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-2 border border-dashed rounded-md">
      <div className="flex justify-between items-start mb-1">
        <div className={`text-xs px-2 py-0.5 rounded-full ${getShiftColor(shift.type)}`}>
          {shift.startTime} - {shift.endTime}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onEdit(shift)}
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce planning ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le planning sera définitivement supprimé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(shift.id)}
                  className="bg-destructive text-destructive-foreground"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {/* Lien vers les tâches du planning */}
      <div className="mb-1">
        <ShiftTasksLink shift={shift} />
      </div>
      
      {/* Afficher les tâches existantes */}
      <TasksInSchedule date={new Date(shift.date)} staffId={shift.staffId} compact={true} />
    </div>
  );
};
