import React from "react";
import { useNavigate } from "react-router-dom";
import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RoomStatusManagerProps {
  room: Room;
  onMakeAvailable: () => Promise<void> | void;
  onToggleMaintenance: (checked: boolean) => Promise<void> | void;
  onToggleCleaning: (checked: boolean) => Promise<void> | void;
}

export default function RoomStatusManager({ 
  room, 
  onMakeAvailable, 
  onToggleMaintenance, 
  onToggleCleaning
}: RoomStatusManagerProps) {
  const navigate = useNavigate();

  const handleBookRoom = () => {
    navigate(`/book-room/${room.id}`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="maintenance">En maintenance</Label>
        <Switch 
          id="maintenance"
          checked={room.maintenanceStatus}
          onCheckedChange={onToggleMaintenance}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="cleaning">À nettoyer</Label>
        <Switch 
          id="cleaning"
          checked={room.cleaningStatus}
          onCheckedChange={onToggleCleaning}
        />
      </div>
      
      {room.status === "available" && !room.maintenanceStatus && !room.cleaningStatus && (
        <Button
          className="w-full"
          onClick={handleBookRoom}
        >
          Réserver cette chambre
        </Button>
      )}

      {room.status === "occupied" && (
        <Button 
          className="w-full"
          variant="secondary"
          onClick={onMakeAvailable}
        >
          Marquer comme disponible
        </Button>
      )}
    </div>
  );
}
