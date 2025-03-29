
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/hooks/useRooms";
import RoomDialog, { RoomFormValues } from "@/components/rooms/RoomDialog";
import { Room, RoomStatus } from "@/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Pencil, 
  Trash2, 
  ChevronLeft,
  Brush
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

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    rooms, 
    loading, 
    error, 
    updateRoom, 
    deleteRoom, 
    changeRoomStatus 
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

  const getStatusIcon = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return <CheckCircle className="size-4 text-green-500" />;
      case "occupied":
        return <CheckCircle className="size-4 text-blue-500" />;
      case "cleaning":
        return <Brush className="size-4 text-yellow-500" />;
      case "cleaning_pending":
        return <Clock className="size-4 text-orange-500" />;
      case "maintenance":
        return <AlertCircle className="size-4 text-red-500" />;
    }
  };

  const getStatusText = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "occupied":
        return "Occupée";
      case "cleaning":
        return "Nettoyage en cours";
      case "cleaning_pending":
        return "Nettoyage requis";
      case "maintenance":
        return "Maintenance";
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

  const handleChangeRoomStatus = async (status: RoomStatus) => {
    if (!room) return;
    
    try {
      await changeRoomStatus(room.id, status);
    } catch (err) {
      console.error("Error changing room status:", err);
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
              <CardTitle>Gestion du statut</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={room.status === 'available' ? 'default' : 'outline'} 
                  className={room.status === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
                  onClick={() => handleChangeRoomStatus('available')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Disponible
                </Button>
                
                <Button
                  variant={room.status === 'occupied' ? 'default' : 'outline'} 
                  className={room.status === 'occupied' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  onClick={() => handleChangeRoomStatus('occupied')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Occupée
                </Button>
                
                <Button
                  variant={room.status === 'cleaning_pending' ? 'default' : 'outline'} 
                  className={room.status === 'cleaning_pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  onClick={() => handleChangeRoomStatus('cleaning_pending')}
                >
                  <Clock className="h-4 w-4 mr-1" /> À nettoyer
                </Button>
                
                <Button
                  variant={room.status === 'cleaning' ? 'default' : 'outline'} 
                  className={room.status === 'cleaning' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                  onClick={() => handleChangeRoomStatus('cleaning')}
                >
                  <Brush className="h-4 w-4 mr-1" /> Nettoyage
                </Button>
                
                <Button
                  variant={room.status === 'maintenance' ? 'default' : 'outline'} 
                  className={room.status === 'maintenance' ? 'bg-red-500 hover:bg-red-600' : ''}
                  onClick={() => handleChangeRoomStatus('maintenance')}
                  className="col-span-2"
                >
                  <AlertCircle className="h-4 w-4 mr-1" /> Maintenance
                </Button>
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
