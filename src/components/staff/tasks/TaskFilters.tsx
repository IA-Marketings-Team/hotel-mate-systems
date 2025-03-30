
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFiltersProps {
  newTask: string;
  setNewTask: (value: string) => void;
  selectedStaff: string;
  setSelectedStaff: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  staffMembers: StaffMember[];
  addTask: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  newTask,
  setNewTask,
  selectedStaff,
  setSelectedStaff,
  selectedStatus,
  setSelectedStatus,
  staffMembers,
  addTask,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="flex-1 flex items-center gap-2 w-full">
        <Input
          placeholder="Ajouter une nouvelle tâche..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="flex-1"
        />
        <Button onClick={addTask}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
      <Select value={selectedStaff} onValueChange={setSelectedStaff}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Assigné à" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les employés</SelectItem>
          {staffMembers.map(staff => (
            <SelectItem key={staff.id} value={staff.id}>
              {staff.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">À faire</SelectItem>
          <SelectItem value="in-progress">En cours</SelectItem>
          <SelectItem value="completed">Terminé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
