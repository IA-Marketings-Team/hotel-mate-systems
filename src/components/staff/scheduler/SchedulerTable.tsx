
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Shift } from "@/hooks/useShiftCrud";
import { 
  Table, 
  TableBody 
} from "@/components/ui/table";
import { SchedulerTableHeader } from "./SchedulerTableHeader";
import { StaffRow } from "./StaffRow";

interface SchedulerTableProps {
  days: Date[];
  filteredStaff: StaffMember[];
  shifts?: Shift[];
  isLoading: boolean;
  onAddShift: (date: Date, staffId?: string) => void;
  onEditShift: (shift: Shift) => void;
  onDeleteShift: (id: string) => void;
}

export const SchedulerTable: React.FC<SchedulerTableProps> = ({
  days,
  filteredStaff,
  shifts,
  isLoading,
  onAddShift,
  onEditShift,
  onDeleteShift
}) => {
  return (
    <div className="border rounded-md overflow-auto">
      <Table>
        <SchedulerTableHeader days={days} />
        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={days.length + 1} className="text-center py-10">
                Chargement du planning...
              </td>
            </tr>
          ) : filteredStaff.length === 0 ? (
            <tr>
              <td colSpan={days.length + 1} className="text-center py-10">
                Aucun employé trouvé
              </td>
            </tr>
          ) : (
            filteredStaff.map(staff => (
              <StaffRow
                key={staff.id}
                staff={staff}
                days={days}
                shifts={shifts || []}
                onAddShift={onAddShift}
                onEditShift={onEditShift}
                onDeleteShift={onDeleteShift}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
