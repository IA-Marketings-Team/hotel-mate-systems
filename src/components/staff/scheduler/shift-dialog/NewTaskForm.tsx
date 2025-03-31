
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface NewTaskFormProps {
  onCancel: () => void;
  onSubmit: (taskData: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
  }) => void;
  isSubmitting: boolean;
}

export const NewTaskForm: React.FC<NewTaskFormProps> = ({
  onCancel,
  onSubmit,
  isSubmitting
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title,
      description,
      priority
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border rounded-md p-3 mt-3 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-6 w-6"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <h4 className="font-medium">Nouvelle tâche</h4>
      
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
          rows={2}
        />
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
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        Ajouter la tâche
      </Button>
    </form>
  );
};
