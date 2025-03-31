
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { StaffMember } from "@/hooks/useStaff";
import { Shift, CreateShiftInput, UpdateShiftInput } from "@/hooks/useShiftCrud";
import { ShiftDialogContent } from "./shift-dialog/ShiftDialogContent";

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
  const [selectedTaskId, setSelectedTaskId] = useState<string>("no-task");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [redirectToTasks, setRedirectToTasks] = useState(!isEditing); // Default to true for new shifts
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTasksCreated, setNewTasksCreated] = useState<Array<{title: string; id?: string}>>([]);
  
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
      setNewTasksCreated([]);
      setShowNewTaskForm(false);
      
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
    setNewTasksCreated([]);
  };

  const handleStaffChange = (staffId: string) => {
    setSelectedStaffId(staffId);
    setSelectedTaskId("no-task");
  };

  const handleCreateNewTask = (taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
  }) => {
    // Ajouter la tâche à la liste des tâches créées localement
    setNewTasksCreated([...newTasksCreated, { title: taskData.title }]);
    setShowNewTaskForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <ShiftDialogContent
          form={form}
          date={date}
          shift={shift}
          staffMembers={staffMembers}
          isSubmitting={isSubmitting}
          selectedStaffId={selectedStaffId}
          preSelectedStaffId={preSelectedStaffId}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
          handleStaffChange={handleStaffChange}
          redirectToTasks={redirectToTasks}
          setRedirectToTasks={setRedirectToTasks}
          newTasksCreated={newTasksCreated}
          setNewTasksCreated={setNewTasksCreated}
          showNewTaskForm={showNewTaskForm}
          setShowNewTaskForm={setShowNewTaskForm}
          handleCreateNewTask={handleCreateNewTask}
          handleSubmit={handleSubmit}
          onOpenChange={onOpenChange}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};
