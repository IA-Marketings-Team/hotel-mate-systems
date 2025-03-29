
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, CheckCircle, Clock, AlertCircle, Plus, Moon, Brush, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/hooks/useRooms";
import RoomDialog, { RoomFormValues } from "@/components/rooms/RoomDialog";
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
    setAllOccupiedToPendingCleaning 
  } = useRooms();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
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
    setRoomDialogOpen(true);
  };

  const handleSaveRoom = async (data: RoomFormValues) => {
    try {
      await addRoom(data as Omit<Room, 'id'>);
    } catch (err) {
      console.error("Error saving room:", err);
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
              </div>
              
              {room.currentGuest && (
                <div className="text-sm text-muted-foreground mt-3">
                  <span className="font-medium text-foreground">Client:</span>{" "}
                  {room.currentGuest}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={() => navigate(`/room/${room.id}`)} 
                  className="w-full"
                >
                  Voir les détails <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <RoomDialog
        open={roomDialogOpen}
        onOpenChange={setRoomDialogOpen}
        onSave={handleSaveRoom}
      />

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
