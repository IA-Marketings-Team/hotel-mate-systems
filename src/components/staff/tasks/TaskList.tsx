
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { TaskItem } from "./TaskItem";
import { ListTodo } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

interface TaskListProps {
  tasks: Task[];
  staffMembers: StaffMember[];
  updateTaskStatus: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  deleteTask: (taskId: string) => void;
  isLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  staffMembers,
  updateTaskStatus,
  deleteTask,
  isLoading
}) => {
  if (isLoading) {
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

  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <ListTodo className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Aucune tâche trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          staffMembers={staffMembers}
          updateTaskStatus={updateTaskStatus}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};
