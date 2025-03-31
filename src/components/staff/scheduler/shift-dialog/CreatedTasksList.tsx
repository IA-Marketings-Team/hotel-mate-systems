
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CreatedTasksListProps {
  tasks: Array<{title: string; id?: string}>;
  onRemove: (index: number) => void;
}

export const CreatedTasksList: React.FC<CreatedTasksListProps> = ({ tasks, onRemove }) => {
  if (tasks.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <Label>Nouvelles tâches créées</Label>
      <div className="space-y-1">
        {tasks.map((task, index) => (
          <div key={index} className="text-sm border rounded-md p-2 flex justify-between items-center">
            <span>{task.title}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
