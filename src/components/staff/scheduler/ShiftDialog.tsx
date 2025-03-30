
import React from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StaffMember } from "@/hooks/useStaff";
import { Shift, CreateShiftInput, UpdateShiftInput } from "@/hooks/useShiftCrud";
import { Task, useTasksContext } from "../StaffTasks";

interface ShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateShiftInput | UpdateShiftInput, selectedTaskId?: string) => Promise<void>;
  staffMembers: StaffMember[];
  date: Date;
  shift?: Shift;
  isSubmitting: boolean;
}

export const ShiftDialog: React.FC<ShiftDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  staffMembers,
  date,
  shift,
  isSubmitting,
}) => {
  const isEditing = !!shift;
  const { tasks } = useTasksContext();
  const [selectedTaskId, setSelectedTaskId] = React.useState<string>("");
  
  const form = useForm<CreateShiftInput | UpdateShiftInput>({
    defaultValues: shift ? {
      id: shift.id,
      staffId: shift.staffId,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: shift.type
    } : {
      date,
      staffId: "",
      startTime: "08:00",
      endTime: "16:00",
      type: "morning" as const
    }
  });

  // Reset selected task when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setSelectedTaskId("");
    }
  }, [open]);

  const handleSubmit = async (values: CreateShiftInput | UpdateShiftInput) => {
    await onSubmit(values, selectedTaskId);
    onOpenChange(false);
    form.reset();
    setSelectedTaskId("");
  };

  // Filter tasks to only show those that aren't assigned to a staff member yet
  // or are assigned to the currently selected staff member
  const availableTasks = tasks.filter(task => 
    task.assignedTo === "" || 
    (form.watch("staffId") && task.assignedTo === form.watch("staffId"))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le planning" : "Ajouter un planning"}
          </DialogTitle>
          <DialogDescription>
            {format(date, "EEEE dd MMMM yyyy", { locale: fr })}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset selected task when staff changes
                      setSelectedTaskId("");
                    }}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un employé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffMembers.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de shift</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="morning">Matin</SelectItem>
                      <SelectItem value="afternoon">Après-midi</SelectItem>
                      <SelectItem value="night">Nuit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("staffId") && (
              <FormItem>
                <FormLabel>Tâche à associer</FormLabel>
                <Select
                  value={selectedTaskId}
                  onValueChange={setSelectedTaskId}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une tâche (optionnel)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Aucune tâche</SelectItem>
                    {availableTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
