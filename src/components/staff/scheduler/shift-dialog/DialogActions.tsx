
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const DialogActions: React.FC<DialogActionsProps> = ({
  isEditing,
  isSubmitting,
  onCancel,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Mettre à jour" : "Ajouter"}
      </Button>
    </div>
  );
};
