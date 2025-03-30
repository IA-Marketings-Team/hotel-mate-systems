
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { useShiftCrud } from "@/hooks/useShiftCrud";
import { ShiftDialog } from "./scheduler/ShiftDialog";
import { SchedulerHeader } from "./scheduler/SchedulerHeader";
import { SchedulerTable } from "./scheduler/SchedulerTable";
import { useSchedulerDays } from "./scheduler/useSchedulerDays";

interface StaffSchedulerProps {
  staffMembers: StaffMember[];
}

export const StaffScheduler: React.FC<StaffSchedulerProps> = ({ staffMembers }) => {
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState<any>(undefined);
  
  const { dateRange, setDateRange, days } = useSchedulerDays();
  const { getShifts, createShift, updateShift, deleteShift } = useShiftCrud();
  const { data: shifts, isLoading } = getShifts;

  // Filter staff based on selection
  const filteredStaff = selectedStaff === "all" 
    ? staffMembers 
    : staffMembers.filter(s => s.id === selectedStaff);

  const handleAddShift = (date: Date) => {
    setSelectedDate(date);
    setSelectedShift(undefined);
    setDialogOpen(true);
  };

  const handleEditShift = (shift: any) => {
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

  return (
    <div className="space-y-6">
      <DashboardCard title="Planning du personnel">
        <SchedulerHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
          staffMembers={staffMembers}
        />
        
        <SchedulerTable
          days={days}
          filteredStaff={filteredStaff}
          shifts={shifts}
          isLoading={isLoading}
          onAddShift={handleAddShift}
          onEditShift={handleEditShift}
          onDeleteShift={handleDeleteShift}
        />
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
