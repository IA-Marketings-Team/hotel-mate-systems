
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { TaskItem } from "./TaskItem";
import { ListTodo } from "lucide-react";

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
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  staffMembers,
  updateTaskStatus,
  deleteTask
}) => {
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
