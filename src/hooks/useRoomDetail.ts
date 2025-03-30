
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "@/hooks/useRooms";
import { Room } from "@/types";
import { RoomFormValues } from "@/components/rooms/RoomDialog";

export const useRoomDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const { 
    rooms, 
    loading, 
    error, 
    updateRoom, 
    deleteRoom, 
    toggleMaintenanceStatus,
    toggleCleaningStatus,
    makeRoomAvailable
  } = useRooms();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (!loading && rooms.length > 0 && id) {
      const foundRoom = rooms.find(r => r.id === id);
      setRoom(foundRoom || null);
    }
  }, [id, rooms, loading]);

  const handleSaveRoom = async (data: RoomFormValues) => {
    if (!room) return;
    
    try {
      await updateRoom(room.id, data);
      setRoomDialogOpen(false);
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  const handleDeleteRoom = async () => {
    if (!room) return;
    
    try {
      await deleteRoom(room.id);
      setDeleteDialogOpen(false);
      navigate("/rooms");
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  const handleToggleMaintenance = async (checked: boolean) => {
    if (!room) return;
    
    try {
      await toggleMaintenanceStatus(room.id, checked);
    } catch (err) {
      console.error("Error toggling maintenance status:", err);
    }
  };

  const handleToggleCleaning = async (checked: boolean) => {
    if (!room) return;
    
    try {
      await toggleCleaningStatus(room.id, checked);
    } catch (err) {
      console.error("Error toggling cleaning status:", err);
    }
  };

  const handleMakeAvailable = async () => {
    if (!room) return;
    
    try {
      await makeRoomAvailable(room.id);
    } catch (err) {
      console.error("Error making room available:", err);
    }
  };

  return {
    room,
    loading,
    error,
    roomDialogOpen,
    setRoomDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleSaveRoom,
    handleDeleteRoom,
    handleToggleMaintenance,
    handleToggleCleaning,
    handleMakeAvailable
  };
};
