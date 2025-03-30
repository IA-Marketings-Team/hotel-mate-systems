
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Shift } from "@/hooks/useShiftCrud";
import { TableCell, TableRow } from "@/components/ui/table";
import { ShiftCell } from "./ShiftCell";
import { isSameDay } from "date-fns";

interface StaffRowProps {
  staff: StaffMember;
  days: Date[];
  shifts: Shift[];
  onAddShift: (date: Date, staffId: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (id: string) => void;
}

export const StaffRow: React.FC<StaffRowProps> = ({
  staff,
  days,
  shifts,
  onAddShift,
  onEditShift,
  onDeleteShift
}) => {
  // Helper function to get shift for a staff member on a specific day
  const getShift = (staffId: string, date: Date) => {
    return shifts?.find(s => 
      s.staffId === staffId && 
      isSameDay(new Date(s.date), date)
    );
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{staff.name}</TableCell>
      {days.map(day => {
        const shift = getShift(staff.id, day);
        return (
          <TableCell key={day.toString()} className="p-1">
            <ShiftCell
              shift={shift}
              date={day}
              onAddShift={() => onAddShift(day, staff.id)}
              onEdit={onEditShift}
              onDelete={onDeleteShift}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
