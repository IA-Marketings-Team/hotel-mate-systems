
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";
import { mapRoomData } from "@/utils/roomUtils";

export const useRoomMaintenance = () => {
  // Function to toggle maintenance status
  const toggleMaintenanceStatus = async (id: string, status: boolean) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          maintenance_status: status 
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom = mapRoomData(data);
      
      toast.success(status 
        ? "Chambre mise en maintenance" 
        : "Chambre retirée de maintenance");
      
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la modification de l'état de maintenance: ${err.message}`);
      console.error("Error toggling maintenance status:", err);
      throw err;
    }
  };

  return {
    toggleMaintenanceStatus
  };
};
