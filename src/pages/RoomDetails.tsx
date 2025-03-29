
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRooms } from "@/hooks/useRooms";
import RoomDialog, { RoomFormValues } from "@/components/rooms/RoomDialog";
import BookingDialog from "@/components/rooms/BookingDialog";
import RoomInfoCard from "@/components/rooms/RoomInfoCard";
import RoomStatusManager from "@/components/rooms/RoomStatusManager";
import { Room } from "@/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { 
  Pencil, 
  Trash2, 
  ChevronLeft
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    rooms, 
    loading, 
    error, 
    updateRoom, 
    deleteRoom, 
    toggleMaintenanceStatus,
    toggleCleaningStatus,
    bookRoom,
    makeRoomAvailable
  } = useRooms();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
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

  const handleBookRoom = async (guestName: string, clientId?: string, extras?: RoomExtra[]) => {
    if (!room) return;
    
    try {
      await bookRoom(room.id, guestName, clientId, extras);
    } catch (err) {
      console.error("Error booking room:", err);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/rooms")}
            >
              <ChevronLeft className="size-4 mr-1" /> Retour
            </Button>
            <Skeleton className="h-8 w-60" />
          </div>
          <div className="grid gap-6">
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !room) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/rooms")}
            >
              <ChevronLeft className="size-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold">Chambre non trouvée</h1>
          </div>
          <div className="text-red-500">
            {error || "Cette chambre n'existe pas ou a été supprimée."}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/rooms")}
            >
              <ChevronLeft className="size-4 mr-1" /> Retour
            </Button>
            <h1 className="text-2xl font-bold">Chambre {room.number}</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setRoomDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Pencil className="size-4" /> Modifier
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="size-4" /> Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RoomInfoCard room={room} />
          <RoomStatusManager 
            room={room}
            onMakeAvailable={handleMakeAvailable}
            onOpenBookingDialog={() => setBookingDialogOpen(true)}
            onToggleMaintenance={handleToggleMaintenance}
            onToggleCleaning={handleToggleCleaning}
          />
        </div>
      </div>

      <RoomDialog
        room={room}
        open={roomDialogOpen}
        onOpenChange={setRoomDialogOpen}
        onSave={handleSaveRoom}
      />

      <BookingDialog
        roomNumber={room.number}
        roomPrice={room.pricePerNight}
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        onConfirm={handleBookRoom}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la chambre {room.number} ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default RoomDetails;
