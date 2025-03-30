
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function FormActions({ 
  onCancel, 
  isSubmitting, 
  submitButtonText = "Enregistrer" 
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Annuler
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "En cours..." : submitButtonText}
      </Button>
    </div>
  );
}
