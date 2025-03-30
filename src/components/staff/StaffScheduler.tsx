
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { DateRange } from "react-day-picker";
import { format, addDays, isSameDay } from "date-fns";
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useShiftCrud, Shift } from "@/hooks/useShiftCrud";
import { ShiftDialog } from "./scheduler/ShiftDialog";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>(undefined);
  
  const { getShifts, createShift, updateShift, deleteShift } = useShiftCrud();
  const { data: shifts, isLoading } = getShifts;

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

  // Helper function to get shift for a staff member on a specific day
  const getShift = (staffId: string, date: Date) => {
    return shifts?.find(s => 
      s.staffId === staffId && 
      isSameDay(new Date(s.date), date)
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

  const handleAddShift = (date: Date) => {
    setSelectedDate(date);
    setSelectedShift(undefined);
    setDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setSelectedDate(new Date(shift.date));
    setDialogOpen(true);
  };

  const handleDeleteShift = async (id: string) => {
    await deleteShift.mutateAsync(id);
  };

  const handleSubmitShift = async (values: any) => {
    if (selectedShift) {
      await updateShift.mutateAsync({
        id: selectedShift.id,
        ...values
      });
    } else {
      await createShift.mutateAsync({
        ...values,
        date: selectedDate
      });
    }
  };

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={days.length + 1} className="text-center py-10">
                    Chargement du planning...
                  </TableCell>
                </TableRow>
              ) : filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={days.length + 1} className="text-center py-10">
                    Aucun employé trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map(staff => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    {days.map(day => {
                      const shift = getShift(staff.id, day);
                      return (
                        <TableCell key={day.toString()} className="text-center">
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
                                  <DropdownMenuItem onClick={() => handleEditShift(shift)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteShift(shift.id)}
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
                                    onClick={() => handleAddShift(day)}
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
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>

      <ShiftDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitShift}
        staffMembers={staffMembers}
        date={selectedDate}
        shift={selectedShift}
        isSubmitting={createShift.isPending || updateShift.isPending}
      />
    </div>
  );
};
