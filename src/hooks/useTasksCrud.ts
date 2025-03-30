
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Task } from "@/components/staff/StaffTasks";

export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

export const useTasksCrud = () => {
  const queryClient = useQueryClient();

  const getTasks = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
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

  const createTask = useMutation({
    mutationFn: async (data: CreateTaskInput) => {
      const { data: result, error } = await supabase
        .from('tasks')
        .insert([{
          title: data.title,
          description: data.description,
          assigned_to: data.assignedTo || null,
          due_date: data.dueDate,
          priority: data.priority,
          status: data.status
        }])
        .select();

      if (error) throw error;
      return result?.[0];
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

  const updateTask = useMutation({
    mutationFn: async (data: UpdateTaskInput) => {
      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.assignedTo !== undefined) updateData.assigned_to = data.assignedTo || null;
      if (data.dueDate) updateData.due_date = data.dueDate;
      if (data.priority) updateData.priority = data.priority;
      if (data.status) updateData.status = data.status;

      const { data: result, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', data.id)
        .select();

      if (error) throw error;
      return result?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tâche mise à jour avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  });

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

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'pending' | 'in-progress' | 'completed' }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  });

  const updateTaskAssignment = useMutation({
    mutationFn: async ({ id, staffId, dueDate }: { id: string, staffId: string, dueDate: Date }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          assigned_to: staffId || null,
          due_date: dueDate
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Assignation mise à jour avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de l'assignation:", error);
      toast.error("Erreur lors de l'assignation");
    }
  });

  return {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskAssignment
  };
};
