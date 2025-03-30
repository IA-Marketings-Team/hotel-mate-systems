
import React from "react";
import { useShiftCrud, Shift } from "@/hooks/useShiftCrud";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getShiftName } from "@/utils/staffUtils";
import { format, addDays, startOfWeek } from "date-fns";
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
    return <div className="flex justify-center p-2">Chargement...</div>;
  }

  if (staffShifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Aucun planning trouvé pour ce membre du personnel
        </p>
      </div>
    );
  }

  // Filtrer pour ne garder que les jours avec un shift planifié
  const daysWithShifts = nextThreeWeeks
    .filter(date => getShiftForDate(date))
    .map(date => ({ date, shift: getShiftForDate(date)! }));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Planning des prochains jours</h3>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Horaire</TableHead>
              <TableHead className="text-xs">Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {daysWithShifts.map(({ date, shift }) => (
              <TableRow key={date.toString()}>
                <TableCell className="py-2 text-xs">
                  {format(date, 'eee dd/MM', { locale: fr })}
                </TableCell>
                <TableCell className="py-2 text-xs">
                  {shift.startTime} - {shift.endTime}
                </TableCell>
                <TableCell className="py-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getShiftColor(shift.type)}`}>
                    {getShiftName(shift.type)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
