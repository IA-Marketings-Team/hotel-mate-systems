
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";
import { mapRoomData } from "@/utils/roomUtils";

export const useRoomCleaning = () => {
  // Function to toggle cleaning status
  const toggleCleaningStatus = async (id: string, status: boolean) => {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          cleaning_status: status,
          last_cleaned: status ? null : now.toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom = mapRoomData(data);
      
      toast.success(status 
        ? "Chambre marquée à nettoyer" 
        : "Nettoyage terminé");
      
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la modification de l'état de nettoyage: ${err.message}`);
      console.error("Error toggling cleaning status:", err);
      throw err;
    }
  };

  return {
    toggleCleaningStatus
  };
};
