
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Shift {
  id: string;
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'night';
}

export interface CreateShiftInput {
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'morning' | 'afternoon' | 'night';
}

export interface UpdateShiftInput extends Partial<CreateShiftInput> {
  id: string;
}

export const useShiftCrud = () => {
  const queryClient = useQueryClient();

  // Fetch all shifts
  const getShifts = useQuery({
    queryKey: ['shifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shifts')
        .select('*');
      
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        staffId: item.staff_id,
        date: new Date(item.date),
        startTime: item.start_time,
        endTime: item.end_time,
        type: item.type
      })) as Shift[];
    }
  });

  // Create a new shift
  const createShift = useMutation({
    mutationFn: async (data: CreateShiftInput) => {
      const { data: result, error } = await supabase
        .from('shifts')
        .insert([{
          staff_id: data.staffId,
          date: data.date.toISOString().split('T')[0], // Format as YYYY-MM-DD for DATE type
          start_time: data.startTime,
          end_time: data.endTime,
          type: data.type
        }])
        .select();

      if (error) throw error;
      return result?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success("Planning ajouté avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la création du planning:", error);
      toast.error("Erreur lors de la création du planning");
    }
  });

  // Update an existing shift
  const updateShift = useMutation({
    mutationFn: async (data: UpdateShiftInput) => {
      const updateData: any = {};
      if (data.staffId) updateData.staff_id = data.staffId;
      if (data.date) updateData.date = data.date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (data.startTime) updateData.start_time = data.startTime;
      if (data.endTime) updateData.end_time = data.endTime;
      if (data.type) updateData.type = data.type;

      const { data: result, error } = await supabase
        .from('shifts')
        .update(updateData)
        .eq('id', data.id)
        .select();

      if (error) throw error;
      return result?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success("Planning mis à jour avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du planning:", error);
      toast.error("Erreur lors de la mise à jour du planning");
    }
  });

  // Delete a shift
  const deleteShift = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success("Planning supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du planning:", error);
      toast.error("Erreur lors de la suppression du planning");
    }
  });

  return {
    getShifts,
    createShift,
    updateShift,
    deleteShift
  };
};
