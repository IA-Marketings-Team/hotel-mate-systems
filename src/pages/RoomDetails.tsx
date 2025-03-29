import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/hooks/useRooms";
import RoomDialog, { RoomFormValues } from "@/components/rooms/RoomDialog";
import BookingDialog from "@/components/rooms/BookingDialog";
import { Room, RoomStatus } from "@/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  CheckCircle, 
  Pencil, 
  Trash2, 
  ChevronLeft,
  Brush,
  User
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const getStatusIcon = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return <CheckCircle className="size-4 text-green-500" />;
      case "occupied":
        return <User className="size-4 text-blue-500" />;
    }
  };

  const getStatusText = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "occupied":
        return "Occupée";
    }
  };

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

  const handleBookRoom = async (guestName: string, clientId?: string) => {
    if (!room) return;
    
    try {
      const updatedRoom = await bookRoom(room.id, guestName);
      
      if (updatedRoom) {
        try {
          const currentUser = "Admin";
          
          const { data, error } = await supabase
            .from('bookings')
            .insert({
              room_id: room.id,
              guest_name: guestName,
              client_id: clientId || null,
              check_in: new Date().toISOString(),
              check_out: new Date(Date.now() + 86400000).toISOString(),
              amount: room.pricePerNight,
              status: 'confirmed',
              created_by: currentUser
            });
          
          if (error) {
            throw error;
          }
          
          toast.success("Chambre réservée et enregistrement créé");
        } catch (err: any) {
          console.error("Error creating booking record:", err);
          toast.error(`Erreur lors de l'enregistrement de la réservation: ${err.message}`);
        }
      }
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
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold">État actuel</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(room.status)}
                    <span className="text-sm">{getStatusText(room.status)}</span>
                  </div>
                </div>

                {room.maintenanceStatus && (
                  <div className="mb-3">
                    <Badge variant="destructive" className="mb-2">En maintenance</Badge>
                  </div>
                )}

                {room.cleaningStatus && (
                  <div className="mb-3">
                    <Badge variant="outline" className="bg-yellow-100 mb-2">À nettoyer</Badge>
                  </div>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm font-medium capitalize">{room.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Capacité:</span>
                    <span className="text-sm font-medium">{room.capacity} personnes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prix:</span>
                    <span className="text-sm font-medium">{room.pricePerNight} € / nuit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Vue:</span>
                    <span className="text-sm font-medium capitalize">{room.view}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Étage:</span>
                    <span className="text-sm font-medium">{room.floor}</span>
                  </div>
                  {room.lastCleaned && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Dernier nettoyage:</span>
                      <span className="text-sm font-medium">
                        {new Date(room.lastCleaned).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <div className="text-sm text-muted-foreground mb-2 w-full">Équipements:</div>
                  {room.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                {room.currentGuest && (
                  <div className="text-sm text-muted-foreground mt-3">
                    <span className="font-medium text-foreground">Client:</span>{" "}
                    {room.currentGuest}
                  </div>
                )}
                
                {room.notes && (
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-foreground">Notes:</span>{" "}
                    {room.notes}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion de la chambre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">État de la chambre</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={room.status === 'available' ? 'default' : 'outline'} 
                      className={room.status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
                      onClick={handleMakeAvailable}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Disponible
                    </Button>
                    
                    <Button
                      variant={room.status === 'occupied' ? 'default' : 'outline'} 
                      className={room.status === 'occupied' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                      onClick={() => setBookingDialogOpen(true)}
                      disabled={room.status === 'occupied'}
                    >
                      <User className="h-4 w-4 mr-1" /> Occuper
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium mb-3">Options additionnelles</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="maintenance-mode">Mode maintenance</Label>
                        <span className="text-sm text-muted-foreground">
                          La chambre nécessite une réparation ou inspection
                        </span>
                      </div>
                      <Switch 
                        id="maintenance-mode" 
                        checked={room.maintenanceStatus}
                        onCheckedChange={handleToggleMaintenance}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="cleaning-mode">Nettoyage requis</Label>
                        <span className="text-sm text-muted-foreground">
                          La chambre nécessite un nettoyage
                        </span>
                      </div>
                      <Switch 
                        id="cleaning-mode" 
                        checked={room.cleaningStatus}
                        onCheckedChange={handleToggleCleaning}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
