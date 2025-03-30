
import React from "react";
import { Shift } from "@/hooks/useShiftCrud";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getShiftName, getShiftColor } from "@/utils/staffUtils";
import { Button } from "@/components/ui/button";
import { TasksInSchedule } from "./TasksInSchedule";

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
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isToday = new Date().toDateString() === date.toDateString();

  const cellClass = `h-20 align-top p-2 border ${
    isWeekend ? "bg-gray-50" : ""
  } ${isToday ? "border-blue-500" : ""}`;

  const dateDisplay = (
    <div className="text-xs text-muted-foreground">
      {format(date, "EEE dd/MM", { locale: fr })}
    </div>
  );

  if (!shift) {
    return (
      <TableCell className={cellClass}>
        {dateDisplay}
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-8 mt-1 text-xs justify-start p-1"
          onClick={() => onAddShift(date)}
        >
          <Plus className="h-3 w-3 mr-1" />
          <span>Ajouter</span>
        </Button>
        
        <TasksInSchedule date={date} compact={true} />
      </TableCell>
    );
  }

  return (
    <TableCell className={cellClass}>
      {dateDisplay}
      <div className="mt-1">
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full text-xs justify-start p-1 ${getShiftColor(shift.type)}`}
                  >
                    <span>{getShiftName(shift.type)}</span>
                    <span className="ml-auto">{shift.startTime} - {shift.endTime}</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                <div>{getShiftName(shift.type)}</div>
                <div>{shift.startTime} - {shift.endTime}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="start">
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
      
      <TasksInSchedule date={date} staffId={shift.staffId} compact={true} />
    </TableCell>
  );
};
