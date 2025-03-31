
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShiftCrud } from "@/hooks/useShiftCrud";

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
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer la tâche"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
