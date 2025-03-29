import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Room, RoomStatus } from "@/types";
import { toast } from "sonner";
import { useRoomCrud } from "./useRoomCrud";
import { useRoomOperations } from "./useRoomOperations";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { DateRange } from "react-day-picker";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const roomCrud = useRoomCrud();
  const roomOperations = useRoomOperations();

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
      
      const typedRooms: Room[] = data.map(room => ({
        ...room,
        id: room.id,
        features: room.features || [],
        notes: room.notes || "",
        pricePerNight: room.price_per_night,
        type: room.type as "standard" | "deluxe" | "suite" | "presidential",
        status: room.status === "occupied" ? "occupied" : "available" as RoomStatus,
        maintenanceStatus: room.maintenance_status === true,
        cleaningStatus: room.cleaning_status === true,
        view: room.view as "garden" | "pool" | "sea" | "mountain" | "city",
        lastCleaned: room.last_cleaned ? new Date(room.last_cleaned) : undefined,
        currentGuest: room.current_guest || undefined
      }));
      
      setRooms(typedRooms);
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors du chargement des chambres");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalRooms = (updatedRoom: Room) => {
    setRooms(prev => prev.map(room => room.id === updatedRoom.id ? updatedRoom : room));
  };

  const addRoom = async (roomData: Omit<Room, 'id'>) => {
    const newRoom = await roomCrud.addRoom(roomData);
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  };

  const updateRoom = async (id: string, roomData: Partial<Room>) => {
    const updatedRoom = await roomCrud.updateRoom(id, roomData);
    updateLocalRooms(updatedRoom);
    return updatedRoom;
  };

  const deleteRoom = async (id: string) => {
    await roomCrud.deleteRoom(id);
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const bookRoom = async (id: string, guestName: string, clientId?: string, extras?: RoomExtra[], dateRange?: DateRange) => {
    const updatedRoom = await roomOperations.bookRoom(id, guestName, clientId, extras, dateRange);
    updateLocalRooms(updatedRoom);
    return updatedRoom;
  };

  const makeRoomAvailable = async (id: string) => {
    const updatedRoom = await roomOperations.makeRoomAvailable(id);
    updateLocalRooms(updatedRoom);
    return updatedRoom;
  };

  const toggleMaintenanceStatus = async (id: string, status: boolean) => {
    const updatedRoom = await roomOperations.toggleMaintenanceStatus(id, status);
    updateLocalRooms(updatedRoom);
    return updatedRoom;
  };

  const toggleCleaningStatus = async (id: string, status: boolean) => {
    const updatedRoom = await roomOperations.toggleCleaningStatus(id, status);
    updateLocalRooms(updatedRoom);
    return updatedRoom;
  };

  const setAllOccupiedToPendingCleaning = async () => {
    const updatedRooms = await roomOperations.setAllOccupiedToPendingCleaning();
    
    setRooms(prev => 
      prev.map(room => {
        const updatedRoom = updatedRooms.find(r => r.id === room.id);
        return updatedRoom || room;
      })
    );
    
    return updatedRooms;
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
    deleteRoom,
    toggleMaintenanceStatus,
    toggleCleaningStatus,
    bookRoom,
    makeRoomAvailable,
    setAllOccupiedToPendingCleaning
  };
};
