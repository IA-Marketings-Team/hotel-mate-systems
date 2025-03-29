
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room, RoomStatus } from "@/types";
import { Search, CheckCircle, Clock, AlertCircle, Plus, Pencil, Trash2, MoreHorizontal, Moon, Brush } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/hooks/useRooms";
import RoomDialog, { RoomFormValues } from "@/components/rooms/RoomDialog";
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
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Rooms = () => {
  const { 
    rooms, 
    loading, 
    error, 
    addRoom, 
    updateRoom, 
    deleteRoom, 
    changeRoomStatus,
    setAllOccupiedToPendingCleaning 
  } = useRooms();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [batchActionDialogOpen, setBatchActionDialogOpen] = useState(false);

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

  const handleOpenAddRoom = () => {
    setSelectedRoom(undefined);
    setRoomDialogOpen(true);
  };

  const handleOpenEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setRoomDialogOpen(true);
  };

  const handleOpenDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleSaveRoom = async (data: RoomFormValues) => {
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, data);
      } else {
        await addRoom(data as Omit<Room, 'id'>);
      }
    } catch (err) {
      console.error("Error saving room:", err);
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      await deleteRoom(roomToDelete.id);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  const handleChangeRoomStatus = async (room: Room, status: RoomStatus) => {
    try {
      await changeRoomStatus(room.id, status);
    } catch (err) {
      console.error("Error changing room status:", err);
    }
  };

  const handleBatchUpdate = async () => {
    try {
      await setAllOccupiedToPendingCleaning();
      setBatchActionDialogOpen(false);
    } catch (err) {
      console.error("Error in batch update:", err);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    // Search term filter
    const matchesSearch =
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.currentGuest &&
        room.currentGuest.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === "all" || room.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return <div className="p-6">Chargement des chambres...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Une erreur est survenue lors du chargement des chambres.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chambres</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setBatchActionDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Moon className="size-4" /> Nettoyage de nuit
          </Button>
          <Button onClick={handleOpenAddRoom} className="flex items-center gap-1">
            <Plus className="size-4" /> Ajouter une chambre
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher une chambre..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="occupied">Occupée</SelectItem>
            <SelectItem value="cleaning">Nettoyage en cours</SelectItem>
            <SelectItem value="cleaning_pending">Nettoyage requis</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="deluxe">Deluxe</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
            <SelectItem value="presidential">Présidentielle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-background">
          <p className="text-muted-foreground">Aucune chambre ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRooms.map((room) => (
            <div key={room.id} className="hotel-card hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">Chambre {room.number}</h3>
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
              <div className="flex justify-between gap-2 mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Statut <MoreHorizontal className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleChangeRoomStatus(room, 'available')}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Disponible
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeRoomStatus(room, 'occupied')}>
                      <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                      Occupée
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeRoomStatus(room, 'cleaning')}>
                      <Brush className="h-4 w-4 mr-2 text-yellow-500" />
                      Nettoyage en cours
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeRoomStatus(room, 'cleaning_pending')}>
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                      Nettoyage requis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleChangeRoomStatus(room, 'maintenance')}>
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      Maintenance
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenEditRoom(room)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Modifier
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleOpenDeleteRoom(room)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RoomDialog
        room={selectedRoom}
        open={roomDialogOpen}
        onOpenChange={setRoomDialogOpen}
        onSave={handleSaveRoom}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la chambre {roomToDelete?.number} ? Cette action ne peut pas être annulée.
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

      <Dialog open={batchActionDialogOpen} onOpenChange={setBatchActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nettoyage de nuit</DialogTitle>
            <DialogDescription>
              Cette action marquera toutes les chambres actuellement occupées comme "en attente de nettoyage". 
              Normalement, cela se fait automatiquement à minuit.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchActionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleBatchUpdate}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
