
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  title: string;
  id?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface CreatedTasksListProps {
  tasks: Task[];
  onRemove: (index: number) => void;
}

export const CreatedTasksList: React.FC<CreatedTasksListProps> = ({ tasks, onRemove }) => {
  if (tasks.length === 0) return null;
  
  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch(priority) {
      case 'low': return "bg-blue-100 text-blue-800";
      case 'medium': return "bg-amber-100 text-amber-800";
      case 'high': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getPriorityLabel = (priority?: 'low' | 'medium' | 'high') => {
    switch(priority) {
      case 'low': return "Basse";
      case 'medium': return "Moyenne";
      case 'high': return "Haute";
      default: return "";
    }
  };
  
  return (
    <div className="space-y-2">
      <Label>Nouvelles tâches créées</Label>
      <div className="space-y-1">
        {tasks.map((task, index) => (
          <div key={index} className="text-sm border rounded-md p-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span>{task.title}</span>
              {task.priority && (
                <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {getPriorityLabel(task.priority)}
                </Badge>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              title="Supprimer cette tâche"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
