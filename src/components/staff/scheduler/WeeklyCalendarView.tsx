
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Shift } from "@/hooks/useShiftCrud";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { getShiftName, getShiftColor } from "@/utils/staffUtils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarDays } from "lucide-react";
import { TasksInSchedule } from "./TasksInSchedule";

interface WeeklyCalendarViewProps {
  days: Date[];
  staffMembers: StaffMember[];
  shifts?: Shift[];
  isLoading: boolean;
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  days,
  staffMembers,
  shifts,
  isLoading
}) => {
  // Generate time slots for the calendar (7:00 to 22:00)
  const timeSlots = Array.from({ length: 16 }, (_, i) => `${i + 7}:00`);

  // Function to get shifts for a specific day and time slot
  const getShiftsForTimeSlot = (day: Date, timeSlot: string) => {
    if (!shifts) return [];
    
    const hour = parseInt(timeSlot.split(':')[0]);
    
    return shifts.filter(shift => {
      // Check if the shift is on this day
      if (!isSameDay(new Date(shift.date), day)) return false;
      
      // Check if the shift covers this time slot
      const startHour = parseInt(shift.startTime.split(':')[0]);
      const endHour = parseInt(shift.endTime.split(':')[0]);
      
      return hour >= startHour && hour < endHour;
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement du planning...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        <h3 className="text-lg font-medium">Planning Hebdomadaire</h3>
      </div>

      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="min-w-[80px]">Heure</TableHead>
              {days.map(day => (
                <TableHead key={day.toString()} className="min-w-[120px] text-center">
                  <div className="flex flex-col">
                    <span>{format(day, 'eee', { locale: fr })}</span>
                    <span className="text-xs">{format(day, 'dd/MM')}</span>
                    <TasksInSchedule date={day} compact={true} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map(timeSlot => (
              <TableRow key={timeSlot}>
                <TableCell className="font-medium">{timeSlot}</TableCell>
                {days.map(day => {
                  const shiftsInSlot = getShiftsForTimeSlot(day, timeSlot);
                  return (
                    <TableCell key={`${day}-${timeSlot}`} className="p-1 border">
                      {shiftsInSlot.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {shiftsInSlot.map(shift => {
                            const staff = staffMembers.find(s => s.id === shift.staffId);
                            return (
                              <TooltipProvider key={shift.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className={`px-2 py-1 rounded-sm text-xs truncate ${getShiftColor(shift.type)}`}>
                                      {staff?.name.split(' ')[0] || 'Staff'}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs space-y-1">
                                      <p><b>{staff?.name}</b></p>
                                      <p>{getShiftName(shift.type)}</p>
                                      <p>{shift.startTime} - {shift.endTime}</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
