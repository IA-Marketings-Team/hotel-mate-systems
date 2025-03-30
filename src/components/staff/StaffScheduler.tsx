
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface StaffSchedulerProps {
  staffMembers: StaffMember[];
}

export const StaffScheduler: React.FC<StaffSchedulerProps> = ({ staffMembers }) => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: addDays(today, 6)
  });
  const [selectedStaff, setSelectedStaff] = useState<string>("all");

  // Generate array of days between from and to dates
  const getDaysArray = () => {
    if (!dateRange.from) return [];
    
    const days = [];
    const start = new Date(dateRange.from);
    const end = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
    
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      days.push(new Date(dt));
    }
    
    return days;
  };

  const days = getDaysArray();

  // Filter staff based on selection
  const filteredStaff = selectedStaff === "all" 
    ? staffMembers 
    : staffMembers.filter(s => s.id === selectedStaff);

  // Mock shifts data - in a real app this would come from a database
  const shifts = [
    { staffId: staffMembers[0]?.id, date: today, startTime: '08:00', endTime: '16:00', type: 'morning' },
    { staffId: staffMembers[1]?.id, date: today, startTime: '16:00', endTime: '00:00', type: 'afternoon' },
    { staffId: staffMembers[2]?.id, date: addDays(today, 1), startTime: '00:00', endTime: '08:00', type: 'night' },
  ];

  // Helper function to get shift for a staff member on a specific day
  const getShift = (staffId: string, date: Date) => {
    return shifts.find(s => 
      s.staffId === staffId && 
      format(s.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Navigation helpers
  const goToPreviousWeek = () => {
    if (!dateRange.from) return;
    
    const newFrom = addDays(dateRange.from, -7);
    const newTo = dateRange.to ? addDays(dateRange.to, -7) : undefined;
    
    setDateRange({ from: newFrom, to: newTo });
  };

  const goToNextWeek = () => {
    if (!dateRange.from) return;
    
    const newFrom = addDays(dateRange.from, 7);
    const newTo = dateRange.to ? addDays(dateRange.to, 7) : undefined;
    
    setDateRange({ from: newFrom, to: newTo });
  };

  return (
    <div className="space-y-6">
      <DashboardCard title="Planning du personnel">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <DatePickerWithRange 
              dateRange={dateRange} 
              onDateRangeChange={setDateRange} 
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                {staffMembers.map(staff => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Shift
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Employé</TableHead>
                {days.map(day => (
                  <TableHead key={day.toString()} className="min-w-[120px] text-center">
                    <div className="flex flex-col">
                      <span>{format(day, 'eee', { locale: fr })}</span>
                      <span className="text-xs">{format(day, 'dd/MM')}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map(staff => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.name}</TableCell>
                  {days.map(day => {
                    const shift = getShift(staff.id, day);
                    return (
                      <TableCell key={day.toString()} className="text-center">
                        {shift ? (
                          <div className={`
                            p-2 rounded-md text-xs font-medium
                            ${shift.type === 'morning' ? 'bg-blue-100 text-blue-800' : 
                              shift.type === 'afternoon' ? 'bg-amber-100 text-amber-800' : 
                              'bg-indigo-100 text-indigo-800'}
                          `}>
                            {shift.startTime} - {shift.endTime}
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="hover:bg-muted">
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
};
