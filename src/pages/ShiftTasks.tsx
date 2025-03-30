
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useShiftCrud } from "@/hooks/useShiftCrud";
import { useStaff } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { TasksContext } from "@/components/staff/StaffTasks";
import { ShiftTasksList } from "@/components/staff/tasks/ShiftTasksList";
import { CreateTaskDialog } from "@/components/staff/tasks/CreateTaskDialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ShiftTasks = () => {
  const { shiftId } = useParams<{ shiftId: string }>();
  const navigate = useNavigate();
  const { getShifts } = useShiftCrud();
  const { data: shifts, isLoading: shiftsLoading } = getShifts;
  const { data: staffMembers, isLoading: staffLoading } = useStaff();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Find the current shift
  const shift = shifts?.find(s => s.id === shiftId);
  
  // Find the staff member assigned to this shift
  const staffMember = staffMembers?.find(s => s.id === shift?.staffId);

  useEffect(() => {
    if (!shiftsLoading && !shift) {
      toast.error("Planning non trouvé");
      navigate("/staff", { state: { activeTab: "scheduler" } });
    }
  }, [shift, shiftsLoading, navigate]);

  const handleBackToScheduler = () => {
    navigate("/staff", { state: { activeTab: "scheduler" } });
  };

  if (shiftsLoading || staffLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!shift || !staffMember) {
    return (
      <AppLayout>
        <div className="p-4 text-center">
          <p>Planning non trouvé</p>
          <Button onClick={handleBackToScheduler} className="mt-4">Retour au planning</Button>
        </div>
      </AppLayout>
    );
  }

  const formattedDate = format(new Date(shift.date), "EEEE dd MMMM yyyy", { locale: fr });

  return (
    <TasksContext.Consumer>
      {(tasksContext) => (
        <AppLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Button 
                  variant="ghost" 
                  onClick={handleBackToScheduler}
                  className="mb-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour au planning
                </Button>
                <h1 className="text-2xl font-bold">Tâches pour le planning du {formattedDate}</h1>
                <p className="text-muted-foreground">
                  {staffMember.name} • {shift.startTime} - {shift.endTime}
                </p>
              </div>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle tâche
              </Button>
            </div>

            <DashboardCard title="Liste des tâches">
              <ShiftTasksList 
                staffId={shift.staffId} 
                date={new Date(shift.date)}
                tasksContext={tasksContext}
              />
            </DashboardCard>
          </div>

          <CreateTaskDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            staffId={shift.staffId}
            date={new Date(shift.date)}
            tasksContext={tasksContext}
          />
        </AppLayout>
      )}
    </TasksContext.Consumer>
  );
};

export default ShiftTasks;
