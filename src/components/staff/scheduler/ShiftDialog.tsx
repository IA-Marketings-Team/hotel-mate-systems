
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { StaffMember } from "@/hooks/useStaff";
import { Shift, CreateShiftInput, UpdateShiftInput } from "@/hooks/useShiftCrud";
import { useTasksContext } from "../StaffTasks";
import { ShiftFormFields } from "./shift-dialog/ShiftFormFields";
import { TaskSelector } from "./shift-dialog/TaskSelector";
import { DialogActions } from "./shift-dialog/DialogActions";
import { useNavigate } from "react-router-dom";
import { Link, Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateShiftInput | UpdateShiftInput, selectedTaskId?: string, redirectToTasks?: boolean) => Promise<void>;
  staffMembers: StaffMember[];
  date: Date;
  shift?: Shift;
  isSubmitting: boolean;
  preSelectedStaffId?: string; // Used to pre-select a staff member
}

export const ShiftDialog: React.FC<ShiftDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  staffMembers,
  date,
  shift,
  isSubmitting,
  preSelectedStaffId,
}) => {
  const isEditing = !!shift;
  const { tasks, isLoading: tasksLoading } = useTasksContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("no-task");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [redirectToTasks, setRedirectToTasks] = useState(!isEditing); // Default to true for new shifts
  const navigate = useNavigate();
  
  // Initialize the form first before using it in useEffect
  const form = useForm<CreateShiftInput | UpdateShiftInput>({
    defaultValues: shift ? {
      id: shift.id,
      staffId: shift.staffId,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: shift.type
    } : {
      date,
      staffId: preSelectedStaffId || "",
      startTime: "08:00",
      endTime: "16:00",
      type: "morning" as const
    }
  });
  
  // Reset the form when opening the dialog
  useEffect(() => {
    if (open) {
      // Reset task selection
      setSelectedTaskId("no-task");
      
      // Initialize with selected staff or from shift
      const initialStaffId = preSelectedStaffId || (shift ? shift.staffId : "");
      setSelectedStaffId(initialStaffId);
      
      // Set redirect to tasks (always true for new shifts)
      setRedirectToTasks(!isEditing);
      
      // Use reset to ensure form values are updated properly
      form.reset({
        ...(shift ? {
          id: shift.id,
          staffId: shift.staffId,
          date: shift.date,
          startTime: shift.startTime,
          endTime: shift.endTime,
          type: shift.type
        } : {
          date,
          staffId: initialStaffId,
          startTime: "08:00",
          endTime: "16:00",
          type: "morning" as const
        })
      });
    }
  }, [open, shift, preSelectedStaffId, date, form, isEditing]);

  const handleSubmit = async (values: CreateShiftInput | UpdateShiftInput) => {    
    await onSubmit(
      values, 
      selectedTaskId === "no-task" ? undefined : selectedTaskId, 
      redirectToTasks
    );
    onOpenChange(false);
    form.reset();
    setSelectedTaskId("no-task");
  };

  const handleStaffChange = (staffId: string) => {
    setSelectedStaffId(staffId);
    setSelectedTaskId("no-task");
  };

  const handleGoToShiftTasks = () => {
    if (shift) {
      navigate(`/shift-tasks/${shift.id}`);
    }
  };

  const availableTasks = tasks.filter(task => 
    task.assignedTo === "" || 
    (selectedStaffId && task.assignedTo === selectedStaffId)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le planning" : "Ajouter un planning"}
          </DialogTitle>
          <DialogDescription>
            {format(date, "EEEE dd MMMM yyyy", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <ShiftFormFields 
              control={form.control}
              staffMembers={staffMembers} 
              isSubmitting={isSubmitting}
              onStaffChange={handleStaffChange}
              disableStaffSelection={!!preSelectedStaffId && !isEditing}
            />

            <TaskSelector 
              selectedTaskId={selectedTaskId} 
              setSelectedTaskId={setSelectedTaskId} 
              availableTasks={availableTasks}
              isSubmitting={isSubmitting}
              isLoading={tasksLoading}
              showTaskSelector={!!selectedStaffId}
            />

            {!isEditing && (
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="redirect" 
                  checked={redirectToTasks}
                  onCheckedChange={setRedirectToTasks}
                />
                <Label htmlFor="redirect" className="cursor-pointer">
                  <div className="flex items-center">
                    <span>Créer des tâches après</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </Label>
              </div>
            )}

            {isEditing && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex items-center text-sm w-full"
                  size="sm"
                  onClick={handleGoToShiftTasks}
                  type="button"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Gérer les tâches pour ce planning
                </Button>
              </div>
            )}

            <DialogActions 
              isEditing={isEditing} 
              isSubmitting={isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
