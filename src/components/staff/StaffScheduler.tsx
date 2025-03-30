
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StaffMember } from "@/hooks/useStaff";
import { useShiftCrud } from "@/hooks/useShiftCrud";
import { ShiftDialog } from "./scheduler/ShiftDialog";
import { SchedulerHeader } from "./scheduler/SchedulerHeader";
import { SchedulerTable } from "./scheduler/SchedulerTable";
import { useSchedulerDays } from "./scheduler/useSchedulerDays";
import { WeeklyCalendarView } from "./scheduler/WeeklyCalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Users } from "lucide-react";
import { TasksContext, useTasksContext } from "./StaffTasks";
import { useNavigate } from "react-router-dom";

interface StaffSchedulerProps {
  staffMembers: StaffMember[];
  onNavigateToTasks?: () => void;
}

export const StaffScheduler: React.FC<StaffSchedulerProps> = ({ 
  staffMembers,
  onNavigateToTasks 
}) => {
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState<any>(undefined);
  
  const { dateRange, setDateRange, days } = useSchedulerDays();
  const { getShifts, createShift, updateShift, deleteShift } = useShiftCrud();
  const { data: shifts, isLoading } = getShifts;
  const navigate = useNavigate();

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

  const handleSubmitShift = async (values: any, selectedTaskId?: string, redirectToTasks: boolean = false) => {
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

    // If a task was selected, update its assignedTo property
    if (selectedTaskId && taskContext) {
      const task = taskContext.tasks.find(t => t.id === selectedTaskId);
      if (task) {
        // Update task assignment to the selected staff member
        taskContext.updateTaskAssignment(selectedTaskId, values.staffId, selectedDate);
      }
    }

    // Redirect to tasks tab if requested
    if (redirectToTasks) {
      if (onNavigateToTasks) {
        onNavigateToTasks();
      } else {
        // If we're in the main staff page, navigate to the tasks tab
        navigate("/staff", { state: { activeTab: "tasks", selectedStaffId: values.staffId, selectedDate } });
      }
    }
  };

  // Get the task context to update task assignments
  const taskContext = useTasksContext();

  return (
    <TasksContext.Consumer>
      {(tasksContext) => (
        <div className="space-y-6">
          <DashboardCard title="Planning du personnel">
            <SchedulerHeader
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedStaff={selectedStaff}
              setSelectedStaff={setSelectedStaff}
              staffMembers={staffMembers}
            />
            
            <Tabs defaultValue="weekly" className="mt-6">
              <TabsList>
                <TabsTrigger value="weekly" className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Vue hebdomadaire</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Vue par employé</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="weekly" className="mt-4">
                <WeeklyCalendarView 
                  days={days}
                  staffMembers={staffMembers}
                  shifts={shifts}
                  isLoading={isLoading}
                />
              </TabsContent>
              
              <TabsContent value="staff" className="mt-4">
                <SchedulerTable
                  days={days}
                  filteredStaff={filteredStaff}
                  shifts={shifts}
                  isLoading={isLoading}
                  onAddShift={handleAddShift}
                  onEditShift={handleEditShift}
                  onDeleteShift={handleDeleteShift}
                />
              </TabsContent>
            </Tabs>
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
      )}
    </TasksContext.Consumer>
  );
};
