
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useShiftCrud } from "@/hooks/useShiftCrud";
import { format } from "date-fns";
import { TaskFormFields } from "./task-form/TaskFormFields";
import { TaskFormActions } from "./task-form/TaskFormActions";

interface CreateIndependentTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffMembers: any[];
  tasksContext: any;
}

export const CreateIndependentTaskDialog: React.FC<CreateIndependentTaskDialogProps> = ({
  open,
  onOpenChange,
  staffMembers,
  tasksContext,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { getShifts, createShift } = useShiftCrud();
  const { data: shifts } = getShifts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Le titre de la tâche est requis");
      return;
    }
    
    if (!staffId) {
      toast.error("Un employé doit être assigné à cette tâche");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vérifier si un planning existe déjà pour cet employé à cette date
      const existingShift = shifts?.find(
        (shift) => 
          shift.staffId === staffId && 
          format(new Date(shift.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      let shiftId;
      
      // Si aucun planning n'existe, en créer un automatiquement
      if (!existingShift) {
        // Créer une planification par défaut (8h-17h)
        const newShift = {
          staffId,
          date,
          startTime: "08:00",
          endTime: "17:00",
          type: "morning" as const
        };
        
        const response = await createShift.mutateAsync(newShift);
        
        if (response) {
          shiftId = response.id;
          toast.success("Planning créé automatiquement");
        } else {
          throw new Error("Échec de la création du planning");
        }
      } else {
        shiftId = existingShift.id;
      }
      
      // Créer la tâche
      await tasksContext.addTask({
        title,
        description,
        assignedTo: staffId,
        dueDate: date,
        priority,
        status: "pending"
      });
      
      // Réinitialiser le formulaire et fermer le dialogue
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStaffId("");
      onOpenChange(false);
      
      toast.success("Tâche créée avec succès");
      
      // Rediriger vers la page des tâches du planning
      navigate(`/shift-tasks/${shiftId}`);
      
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Erreur lors de la création de la tâche");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle tâche</DialogTitle>
          <DialogDescription>
            Cette tâche sera assignée à un employé et créera automatiquement un planning si nécessaire
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TaskFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            priority={priority}
            setPriority={setPriority}
            staffId={staffId}
            setStaffId={setStaffId}
            date={date}
            setDate={setDate}
            staffMembers={staffMembers}
            isSubmitting={isSubmitting}
          />
          
          <TaskFormActions
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
