
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember } from "@/hooks/useStaff";
import { toast } from "sonner";

interface CreateStaffInput {
  name: string;
  role: string;
  email: string;
  contactNumber: string;
  shift: string;
  isAvailable: boolean;
}

interface UpdateStaffInput extends Partial<CreateStaffInput> {
  id: string;
}

export const useStaffCrud = () => {
  const queryClient = useQueryClient();

  const createStaff = useMutation({
    mutationFn: async (data: CreateStaffInput) => {
      const { data: result, error } = await supabase
        .from('staff')
        .insert([{
          name: data.name,
          role: data.role,
          email: data.email,
          contact_number: data.contactNumber,
          shift: data.shift,
          is_available: data.isAvailable
        }])
        .select();

      if (error) throw error;
      return result?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success("Employé créé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la création de l'employé:", error);
      toast.error("Erreur lors de la création de l'employé");
    }
  });

  const updateStaff = useMutation({
    mutationFn: async (data: UpdateStaffInput) => {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.role) updateData.role = data.role;
      if (data.email) updateData.email = data.email;
      if (data.contactNumber) updateData.contact_number = data.contactNumber;
      if (data.shift) updateData.shift = data.shift;
      if (data.isAvailable !== undefined) updateData.is_available = data.isAvailable;

      const { data: result, error } = await supabase
        .from('staff')
        .update(updateData)
        .eq('id', data.id)
        .select();

      if (error) throw error;
      return result?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success("Employé mis à jour avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      toast.error("Erreur lors de la mise à jour de l'employé");
    }
  });

  const deleteStaff = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success("Employé supprimé avec succès");
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de l'employé:", error);
      toast.error("Erreur lors de la suppression de l'employé");
    }
  });

  const toggleStaffAvailability = useMutation({
    mutationFn: async (staffMember: StaffMember) => {
      const { error } = await supabase
        .from('staff')
        .update({ is_available: !staffMember.isAvailable })
        .eq('id', staffMember.id);

      if (error) throw error;
      return {
        ...staffMember,
        isAvailable: !staffMember.isAvailable
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (error) => {
      console.error("Erreur lors du changement de disponibilité:", error);
      toast.error("Erreur lors du changement de disponibilité");
    }
  });

  return {
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffAvailability
  };
};
