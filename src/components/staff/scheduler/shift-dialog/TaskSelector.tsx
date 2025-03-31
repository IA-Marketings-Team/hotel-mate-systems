
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskSelectorProps {
  selectedTaskId: string;
  setSelectedTaskId: (value: string) => void;
  availableTasks: Task[];
  isSubmitting: boolean;
  isLoading: boolean;
  showTaskSelector: boolean;
  onCreateNewTask?: () => void;
}

const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch(priority) {
    case 'low': return "bg-blue-100 text-blue-800";
    case 'medium': return "bg-amber-100 text-amber-800";
    case 'high': return "bg-red-100 text-red-800";
  }
};

export const TaskSelector: React.FC<TaskSelectorProps> = ({
  selectedTaskId,
  setSelectedTaskId,
  availableTasks,
  isSubmitting,
  isLoading,
  showTaskSelector,
  onCreateNewTask
}) => {
  if (!showTaskSelector) return null;

  return (
    <div className="space-y-3">
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
              <SelectItem key={task.id} value={task.id} className="flex items-center">
                <div>
                  <span className="mr-2">{task.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
      
      {onCreateNewTask && (
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onCreateNewTask}
          disabled={isSubmitting}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Créer une nouvelle tâche
        </Button>
      )}
    </div>
  );
};
