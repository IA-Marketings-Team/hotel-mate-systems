
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";

export const useRoomCrud = () => {
  const [error, setError] = useState<string | null>(null);

  // Function to add a new room
  const addRoom = async (roomData: Omit<Room, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          number: roomData.number,
          type: roomData.type,
          capacity: roomData.capacity,
          price_per_night: roomData.pricePerNight,
          floor: roomData.floor,
          view: roomData.view,
          status: roomData.status,
          maintenance_status: roomData.maintenanceStatus || false,
          cleaning_status: roomData.cleaningStatus || false,
          features: roomData.features,
          notes: roomData.notes,
          last_cleaned: roomData.lastCleaned ? roomData.lastCleaned.toISOString() : null,
          current_guest: roomData.currentGuest || null
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const newRoom: Room = mapRoomData(data);

      toast.success(`Chambre ${roomData.number} ajoutée avec succès`);
      return newRoom;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erreur lors de l'ajout de la chambre: ${err.message}`);
      console.error("Error adding room:", err);
      throw err;
    }
  };

  // Function to update a room
  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    try {
      const dbData: any = {
        ...roomData
      };
      
      if (roomData.pricePerNight !== undefined) {
        dbData.price_per_night = roomData.pricePerNight;
        delete dbData.pricePerNight;
      }
      
      if (roomData.lastCleaned !== undefined) {
        dbData.last_cleaned = roomData.lastCleaned ? roomData.lastCleaned.toISOString() : null;
        delete dbData.lastCleaned;
      }
      
      if (roomData.currentGuest !== undefined) {
        dbData.current_guest = roomData.currentGuest || null;
        delete dbData.currentGuest;
      }

      if (roomData.maintenanceStatus !== undefined) {
        dbData.maintenance_status = roomData.maintenanceStatus;
        delete dbData.maintenanceStatus;
      }

      if (roomData.cleaningStatus !== undefined) {
        dbData.cleaning_status = roomData.cleaningStatus;
        delete dbData.cleaningStatus;
      }

      // Simplify status to only available or occupied
      if (roomData.status) {
        dbData.status = roomData.status === "occupied" ? "occupied" : "available";
      }

      const { data, error } = await supabase
        .from('rooms')
        .update(dbData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom: Room = mapRoomData(data);

      toast.success(`Chambre ${updatedRoom.number} mise à jour avec succès`);
      return updatedRoom;
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erreur lors de la mise à jour de la chambre: ${err.message}`);
      console.error("Error updating room:", err);
      throw err;
    }
  };

  // Function to delete a room
  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success(`Chambre supprimée avec succès`);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erreur lors de la suppression de la chambre: ${err.message}`);
      console.error("Error deleting room:", err);
      throw err;
    }
  };

  return {
    error,
    addRoom,
    updateRoom,
    deleteRoom
  };
};

// Helper function to map database room data to our Room type
const mapRoomData = (data: any): Room => ({
  ...data,
  pricePerNight: data.price_per_night,
  type: data.type as "standard" | "deluxe" | "suite" | "presidential",
  status: data.status === "occupied" ? "occupied" : "available",
  maintenanceStatus: data.maintenance_status === true,
  cleaningStatus: data.cleaning_status === true,
  view: data.view as "garden" | "pool" | "sea" | "mountain" | "city",
  lastCleaned: data.last_cleaned ? new Date(data.last_cleaned) : undefined,
  currentGuest: data.current_guest || undefined,
  features: data.features || [],
  notes: data.notes || ""
});
