
import React from "react";
import { Button } from "@/components/ui/button";

interface TaskFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onCancel,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Créer la tâche"}
      </Button>
    </div>
  );
};
