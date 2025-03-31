
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { StaffMember } from "@/hooks/useStaff";
import { Shift, CreateShiftInput, UpdateShiftInput } from "@/hooks/useShiftCrud";
import { useTasksContext } from "../../StaffTasks";
import { ShiftFormFields } from "./ShiftFormFields";
import { TaskSelector } from "./TaskSelector";
import { DialogActions } from "./DialogActions";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NewTaskForm } from "./NewTaskForm";
import { CreatedTasksList } from "./CreatedTasksList";

interface ShiftDialogContentProps {
  form: any;
  date: Date;
  shift?: Shift;
  staffMembers: StaffMember[];
  isSubmitting: boolean;
  selectedStaffId: string;
  preSelectedStaffId?: string;
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  handleStaffChange: (staffId: string) => void;
  redirectToTasks: boolean;
  setRedirectToTasks: (value: boolean) => void;
  newTasksCreated: Array<{title: string; id?: string}>;
  setNewTasksCreated: React.Dispatch<React.SetStateAction<Array<{title: string; id?: string}>>>;
  showNewTaskForm: boolean;
  setShowNewTaskForm: (value: boolean) => void;
  handleCreateNewTask: (taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  handleSubmit: (values: CreateShiftInput | UpdateShiftInput) => Promise<void>;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
}

export const ShiftDialogContent: React.FC<ShiftDialogContentProps> = ({
  form,
  date,
  shift,
  staffMembers,
  isSubmitting,
  selectedStaffId,
  preSelectedStaffId,
  selectedTaskId,
  setSelectedTaskId,
  handleStaffChange,
  redirectToTasks,
  setRedirectToTasks,
  newTasksCreated,
  setNewTasksCreated,
  showNewTaskForm,
  setShowNewTaskForm,
  handleCreateNewTask,
  handleSubmit,
  onOpenChange,
  isEditing
}) => {
  const { tasks, isLoading: tasksLoading } = useTasksContext();
  const navigate = useNavigate();

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
    <>
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

          {/* Liste des tâches créées dans ce formulaire */}
          {newTasksCreated.length > 0 && (
            <CreatedTasksList 
              tasks={newTasksCreated} 
              onRemove={(index) => {
                setNewTasksCreated(newTasksCreated.filter((_, i) => i !== index));
              }} 
            />
          )}

          {showNewTaskForm ? (
            <NewTaskForm 
              onCancel={() => setShowNewTaskForm(false)}
              onSubmit={handleCreateNewTask}
              isSubmitting={isSubmitting}
            />
          ) : (
            <TaskSelector 
              selectedTaskId={selectedTaskId} 
              setSelectedTaskId={setSelectedTaskId} 
              availableTasks={availableTasks}
              isSubmitting={isSubmitting}
              isLoading={tasksLoading}
              showTaskSelector={!!selectedStaffId}
              onCreateNewTask={() => setShowNewTaskForm(true)}
            />
          )}

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
    </>
  );
};
