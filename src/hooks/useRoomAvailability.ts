
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";
import { mapRoomData } from "@/utils/roomUtils";

export const useRoomAvailability = () => {
  // Function to make a room available
  const makeRoomAvailable = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          status: 'available',
          current_guest: null
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom = mapRoomData(data);
      
      toast.success("Chambre marquée comme disponible");
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la modification du statut: ${err.message}`);
      console.error("Error changing room status:", err);
      throw err;
    }
  };

  // Function to set all occupied rooms to available
  const setAllOccupiedToPendingCleaning = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          status: 'available',
          current_guest: null  // Clear the current guest when making room available
        })
        .eq('status', 'occupied')
        .select('*');

      if (error) {
        throw error;
      }

      const updatedRooms = data.map(mapRoomData);

      toast.success(`Toutes les chambres occupées sont maintenant disponibles`);
      return updatedRooms;
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour des statuts: ${err.message}`);
      console.error("Error updating room statuses:", err);
      throw err;
    }
  };

  return {
    makeRoomAvailable,
    setAllOccupiedToPendingCleaning
  };
};
