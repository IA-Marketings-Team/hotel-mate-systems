
import React from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/components/staff/StaffTasks";

interface TaskSelectorProps {
  selectedTaskId: string;
  setSelectedTaskId: (value: string) => void;
  availableTasks: Task[];
  isSubmitting: boolean;
  isLoading: boolean;
  showTaskSelector: boolean;
}

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  selectedTaskId,
  setSelectedTaskId,
  availableTasks,
  isSubmitting,
  isLoading,
  showTaskSelector,
}) => {
  if (!showTaskSelector) return null;

  return (
    <FormItem>
      <FormLabel>Tâche à associer</FormLabel>
      <Select
        value={selectedTaskId}
        onValueChange={setSelectedTaskId}
        disabled={isSubmitting || isLoading}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une tâche (optionnel)" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="no-task">Aucune tâche</SelectItem>
          {availableTasks.map((task) => (
            <SelectItem key={task.id} value={task.id}>
              {task.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
