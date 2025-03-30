
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
import { RedirectCheckbox } from "./shift-dialog/RedirectCheckbox";
import { DialogActions } from "./shift-dialog/DialogActions";

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateShiftInput | UpdateShiftInput, selectedTaskId?: string, redirectToTasks?: boolean) => Promise<void>;
  staffMembers: StaffMember[];
  date: Date;
  shift?: Shift;
  isSubmitting: boolean;
}

export const ShiftDialog: React.FC<ShiftDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  staffMembers,
  date,
  shift,
  isSubmitting,
}) => {
  const isEditing = !!shift;
  const { tasks, isLoading: tasksLoading } = useTasksContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("no-task");
  const [redirectToTasks, setRedirectToTasks] = useState<boolean>(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  
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
      staffId: "",
      startTime: "08:00",
      endTime: "16:00",
      type: "morning" as const
    }
  });

  // Reset selected task when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedTaskId("no-task");
      setRedirectToTasks(false);
      setSelectedStaffId(form.getValues().staffId);
    }
  }, [open, form]);

  const handleSubmit = async (values: CreateShiftInput | UpdateShiftInput) => {
    await onSubmit(
      values, 
      selectedTaskId === "no-task" ? undefined : selectedTaskId, 
      redirectToTasks
    );
    onOpenChange(false);
    form.reset();
    setSelectedTaskId("no-task");
    setRedirectToTasks(false);
  };

  // Handle staff selection change
  const handleStaffChange = (staffId: string) => {
    setSelectedStaffId(staffId);
    setSelectedTaskId("no-task");
  };

  // Filter tasks to only show those that aren't assigned to a staff member yet
  // or are assigned to the currently selected staff member
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
              <RedirectCheckbox 
                redirectToTasks={redirectToTasks} 
                setRedirectToTasks={setRedirectToTasks} 
              />
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
