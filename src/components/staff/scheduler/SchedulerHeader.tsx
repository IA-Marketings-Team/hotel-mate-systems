
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { addDays } from "date-fns";
import { StaffMember } from "@/hooks/useStaff";

interface SchedulerHeaderProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  selectedStaff: string;
  setSelectedStaff: (staffId: string) => void;
  staffMembers: StaffMember[];
}

export const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  dateRange,
  setDateRange,
  selectedStaff,
  setSelectedStaff,
  staffMembers
}) => {
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
      </div>
    </div>
  );
};
