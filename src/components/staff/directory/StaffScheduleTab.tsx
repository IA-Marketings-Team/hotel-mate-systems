
import React from "react";
import { useShiftCrud, Shift } from "@/hooks/useShiftCrud";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getShiftName } from "@/utils/staffUtils";
import { format, isThisWeek, addDays, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarClock, AlertCircle } from "lucide-react";

interface StaffScheduleTabProps {
  staffId: string;
}

export const StaffScheduleTab: React.FC<StaffScheduleTabProps> = ({ staffId }) => {
  const { getShifts } = useShiftCrud();
  const { data: shifts, isLoading } = getShifts;

  // Filtrer les shifts pour ce membre du personnel
  const staffShifts = shifts?.filter(shift => shift.staffId === staffId) || [];

  // Obtenir les dates de la semaine actuelle et des 2 prochaines semaines
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const nextThreeWeeks = Array.from({ length: 21 }, (_, i) => 
    addDays(currentWeekStart, i)
  );

  // Fonction pour obtenir le shift d'un jour spécifique
  const getShiftForDate = (date: Date): Shift | undefined => {
    return staffShifts.find(shift => 
      format(new Date(shift.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Formatage pour l'affichage des shifts
  const getShiftDisplay = (shift: Shift) => {
    return `${shift.startTime} - ${shift.endTime} (${getShiftName(shift.type)})`;
  };

  // Coloration du shift selon son type
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

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement du planning...</div>;
  }

  if (staffShifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucun planning trouvé</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Ce membre du personnel n'a pas de shifts planifiés prochainement.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Planning des prochaines semaines</h3>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Jour</TableHead>
              <TableHead>Shift</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nextThreeWeeks.map(date => {
              const shift = getShiftForDate(date);
              return (
                <TableRow key={date.toString()} className={shift ? "" : "opacity-60"}>
                  <TableCell>{format(date, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{format(date, 'EEEE', { locale: fr })}</TableCell>
                  <TableCell>
                    {shift ? (
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getShiftColor(shift.type)}`}>
                        {getShiftDisplay(shift)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Pas de shift</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
