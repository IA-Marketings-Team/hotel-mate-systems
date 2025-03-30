
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TaskItem } from "./TaskItem";
import { ListTodo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ShiftTasksListProps {
  staffId: string;
  date: Date;
  tasksContext: any;
}

export const ShiftTasksList: React.FC<ShiftTasksListProps> = ({
  staffId,
  date,
  tasksContext
}) => {
  // Filter tasks for this specific shift (staff member and date)
  const filteredTasks = tasksContext.tasks.filter(
    (task: any) => 
      task.assignedTo === staffId && 
      format(new Date(task.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  if (tasksContext.isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-full max-w-[250px] mb-2" />
                <Skeleton className="h-4 w-full max-w-[400px] mb-3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Aucune tâche pour ce planning</p>
        <p className="text-xs text-muted-foreground mt-2">
          Cliquez sur "Nouvelle tâche" pour en ajouter
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task: any) => (
        <TaskItem
          key={task.id}
          task={task}
          staffMembers={[]}  // Not needed here as we already know the staff member
          updateTaskStatus={tasksContext.updateTaskStatus}
          deleteTask={tasksContext.deleteTask}
        />
      ))}
    </div>
  );
};
