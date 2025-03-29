
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
import { mockRooms } from "@/lib/mock-data";
import { Room, RoomStatus } from "@/types";
import { Search, CheckCircle, Clock, AlertCircle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getStatusIcon = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return <CheckCircle className="size-4 text-green-500" />;
      case "occupied":
        return <CheckCircle className="size-4 text-blue-500" />;
      case "cleaning":
        return <Clock className="size-4 text-yellow-500" />;
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
        return "Nettoyage";
      case "maintenance":
        return "Maintenance";
    }
  };

  const filteredRooms = mockRooms.filter((room) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chambres</h1>
        <Button>Ajouter une chambre</Button>
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
            <SelectItem value="cleaning">Nettoyage</SelectItem>
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
                <span className="font-medium text-foreground">Client:</span> {room.currentGuest}
              </div>
            )}
            {room.notes && (
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground">Notes:</span> {room.notes}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">
                Détails
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
