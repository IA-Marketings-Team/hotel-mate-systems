
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('number', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setRooms(data.map(room => ({
        ...room,
        id: room.id,
        features: room.features || [],
        notes: room.notes || "",
        pricePerNight: room.price_per_night,
        lastCleaned: room.last_cleaned ? new Date(room.last_cleaned) : undefined,
        currentGuest: room.current_guest || undefined
      })));
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors du chargement des chambres");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

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

      // Convert returned data to our Room type format
      const newRoom: Room = {
        ...data,
        pricePerNight: data.price_per_night,
        lastCleaned: data.last_cleaned ? new Date(data.last_cleaned) : undefined,
        currentGuest: data.current_guest || undefined
      };

      setRooms(prev => [...prev, newRoom]);
      toast.success(`Chambre ${roomData.number} ajoutée avec succès`);
      return newRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de l'ajout de la chambre: ${err.message}`);
      console.error("Error adding room:", err);
      throw err;
    }
  };

  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    try {
      // Convert from our Room type to the database schema
      const dbData: any = {
        ...roomData
      };
      
      // Handle specific field conversions
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

      const { data, error } = await supabase
        .from('rooms')
        .update(dbData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      // Convert returned data to our Room type format
      const updatedRoom: Room = {
        ...data,
        pricePerNight: data.price_per_night,
        lastCleaned: data.last_cleaned ? new Date(data.last_cleaned) : undefined,
        currentGuest: data.current_guest || undefined
      };

      setRooms(prev => prev.map(room => room.id === id ? updatedRoom : room));
      toast.success(`Chambre ${updatedRoom.number} mise à jour avec succès`);
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour de la chambre: ${err.message}`);
      console.error("Error updating room:", err);
      throw err;
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setRooms(prev => prev.filter(room => room.id !== id));
      toast.success(`Chambre supprimée avec succès`);
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression de la chambre: ${err.message}`);
      console.error("Error deleting room:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    addRoom,
    updateRoom,
    deleteRoom
  };
};
