
import React from "react";
import { format, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Task, useTasksContext } from "../StaffTasks";
import { StaffMember } from "@/hooks/useStaff";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Circle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TasksInScheduleProps {
  date: Date;
  staffId?: string;
  compact?: boolean;
}

const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch(priority) {
    case 'low':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case 'medium':
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case 'high':
      return "bg-red-100 text-red-800 hover:bg-red-200";
  }
};

const getStatusIcon = (status: 'pending' | 'in-progress' | 'completed') => {
  switch(status) {
    case 'pending':
      return <Circle className="h-3 w-3" />;
    case 'in-progress':
      return <Clock className="h-3 w-3" />;
    case 'completed':
      return <CheckCircle2 className="h-3 w-3" />;
  }
};

export const TasksInSchedule: React.FC<TasksInScheduleProps> = ({ date, staffId, compact = false }) => {
  const { tasks } = useTasksContext();
  
  // Filtrer les tâches pour cette date et ce membre du personnel si spécifié
  const filteredTasks = tasks.filter(task => {
    const sameDay = isSameDay(new Date(task.dueDate), date);
    if (!sameDay) return false;
    
    if (staffId) {
      return task.assignedTo === staffId;
    }
    
    return true;
  });
  
  if (filteredTasks.length === 0) {
    return null;
  }
  
  return (
    <div className={`mt-1 space-y-1 ${compact ? 'pt-1' : 'pt-2'}`}>
      {filteredTasks.map(task => (
        <TooltipProvider key={task.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline" 
                className={`${getPriorityColor(task.priority)} text-xs cursor-default ${compact ? 'py-0.5' : ''}`}
              >
                <span className="mr-1">{getStatusIcon(task.status)}</span>
                <span className="truncate">{task.title}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs space-y-1">
                <p className="font-semibold">{task.title}</p>
                {task.description && <p>{task.description}</p>}
                <p>Échéance: {format(new Date(task.dueDate), 'dd MMMM', { locale: fr })}</p>
                <p>Priorité: {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}</p>
                <p>Statut: {task.status === 'completed' ? 'Terminé' : task.status === 'in-progress' ? 'En cours' : 'À faire'}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
