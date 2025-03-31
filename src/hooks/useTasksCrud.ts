
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export const useTasksCrud = () => {
  const queryClient = useQueryClient();

  // Fetch all tasks
  const getTasks = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      
      return data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        assignedTo: task.assigned_to || '',
        dueDate: new Date(task.due_date),
        priority: task.priority as 'low' | 'medium' | 'high',
        status: task.status as 'pending' | 'in-progress' | 'completed'
      })) as Task[];
    }
  });

  // Create a new task
  const createTask = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id'>) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: taskData.title,
          description: taskData.description,
          assigned_to: taskData.assignedTo,
          due_date: taskData.dueDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD
          priority: taskData.priority,
          status: taskData.status
        }])
        .select();

      if (error) throw error;
      
      // Simuler une notification à l'employé (dans une app réelle, on utiliserait un système de notification)
      console.log(`Notification: Nouvelle tâche "${taskData.title}" assignée à l'employé ${taskData.assignedTo}`);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tâche créée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la tâche:", error);
      toast.error("Erreur lors de la création de la tâche");
    }
  });

  // Update task status
  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pending' | 'in-progress' | 'completed' }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      // Simuler une notification de mise à jour de statut
      console.log(`Notification: Statut de la tâche mis à jour à "${status}"`);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Statut de la tâche mis à jour");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  // Delete a task
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tâche supprimée avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la tâche:", error);
      toast.error("Erreur lors de la suppression de la tâche");
    }
  });

  // Update task assignment (staff and due date)
  const updateTaskAssignment = useMutation({
    mutationFn: async ({ id, staffId, dueDate }: { id: string; staffId: string; dueDate: Date }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          assigned_to: staffId,
          due_date: dueDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      
      // Simuler une notification de réassignation
      console.log(`Notification: Tâche réassignée à l'employé ${staffId}`);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Assignation de la tâche mise à jour");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'assignation:", error);
      toast.error("Erreur lors de la mise à jour de l'assignation");
    }
  });

  return {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    updateTaskAssignment
  };
};
