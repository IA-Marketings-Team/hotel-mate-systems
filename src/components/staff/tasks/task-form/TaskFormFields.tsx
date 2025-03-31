
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StaffMember } from "@/hooks/useStaff";

interface TaskFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  priority: "low" | "medium" | "high";
  setPriority: (value: "low" | "medium" | "high") => void;
  staffId: string;
  setStaffId: (value: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  staffMembers: StaffMember[];
  isSubmitting: boolean;
}

export const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  staffId,
  setStaffId,
  date,
  setDate,
  staffMembers,
  isSubmitting,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la tâche"
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnelle)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description détaillée de la tâche"
          disabled={isSubmitting}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="staff">Assigner à</Label>
        <Select 
          value={staffId} 
          onValueChange={setStaffId}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un employé" />
          </SelectTrigger>
          <SelectContent>
            {staffMembers.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date d'échéance</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !date && "text-muted-foreground"
              }`}
              disabled={isSubmitting}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "dd MMMM yyyy", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority">Priorité</Label>
        <Select 
          value={priority} 
          onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

// Import du bouton qui est utilisé dans le composant mais défini à l'extérieur
import { Button } from "@/components/ui/button";
