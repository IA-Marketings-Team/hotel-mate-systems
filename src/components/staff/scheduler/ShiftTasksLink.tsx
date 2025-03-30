
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { Shift } from "@/hooks/useShiftCrud";

interface ShiftTasksLinkProps {
  shift: Shift;
}

export const ShiftTasksLink: React.FC<ShiftTasksLinkProps> = ({ shift }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/shift-tasks/${shift.id}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="px-1.5 py-1 h-auto text-xs"
      onClick={handleClick}
    >
      <ListTodo className="h-3 w-3 mr-1" />
      <span>Tâches</span>
    </Button>
  );
};
