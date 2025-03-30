
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface RedirectCheckboxProps {
  redirectToTasks: boolean;
  setRedirectToTasks: (checked: boolean) => void;
}

export const RedirectCheckbox: React.FC<RedirectCheckboxProps> = ({
  redirectToTasks,
  setRedirectToTasks,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="redirect-tasks" 
        checked={redirectToTasks}
        onCheckedChange={(checked) => setRedirectToTasks(checked as boolean)}
      />
      <label
        htmlFor="redirect-tasks"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Créer des tâches pour cette période après la création
      </label>
    </div>
  );
};
