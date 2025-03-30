
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, Square, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

interface TaskItemProps {
  task: Task;
  staffMembers: StaffMember[];
  updateTaskStatus: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
  deleteTask: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  staffMembers,
  updateTaskStatus,
  deleteTask
}) => {
  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch(priority) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Basse</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">Moyenne</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Haute</Badge>;
    }
  };

  const getAssigneeName = (assignedTo: string) => {
    const staff = staffMembers.find(s => s.id === assignedTo);
    return staff ? staff.name : 'Non assigné';
  };

  return (
    <div className={`
      p-4 border rounded-lg transition-all
      ${task.status === 'completed' ? 'bg-muted' : 'bg-white'}
      ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : 
        task.priority === 'medium' ? 'border-l-4 border-l-amber-500' :
        'border-l-4 border-l-blue-500'}
    `}>
      <div className="flex items-start gap-3">
        <div className="pt-1">
          {task.status === 'completed' ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 text-green-600"
              onClick={() => updateTaskStatus(task.id, 'pending')}
            >
              <Check className="h-4 w-4" />
            </Button>
          ) : task.status === 'in-progress' ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 text-amber-500"
              onClick={() => updateTaskStatus(task.id, 'completed')}
            >
              <Clock className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5"
              onClick={() => updateTaskStatus(task.id, 'in-progress')}
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {getAssigneeName(task.assignedTo)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {format(task.dueDate, 'dd MMM', { locale: fr })}
            </Badge>
            {getPriorityBadge(task.priority)}
          </div>
        </div>
      </div>
    </div>
  );
};
