
import React from "react";
import { Shift } from "@/hooks/useShiftCrud";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShiftCellProps {
  shift?: Shift;
  date: Date;
  onAddShift: (date: Date) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (id: string) => void;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  shift,
  date,
  onAddShift,
  onEditShift,
  onDeleteShift
}) => {
  // Helper to get shift background color
  const getShiftColor = (type: string) => {
    switch (type) {
      case "morning":
        return "bg-blue-100 text-blue-800"; 
      case "afternoon":
        return "bg-amber-100 text-amber-800";
      case "night":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TableCell className="text-center">
      {shift ? (
        <div className="relative flex items-center">
          <div className={`
            p-2 rounded-md text-xs font-medium w-full
            ${getShiftColor(shift.type)}
          `}>
            {shift.startTime} - {shift.endTime}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full opacity-0 hover:opacity-100 rounded-l-none"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditShift(shift)}>
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onDeleteShift(shift.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-muted"
                onClick={() => onAddShift(date)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ajouter un shift</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </TableCell>
  );
};
