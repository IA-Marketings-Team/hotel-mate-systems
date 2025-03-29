
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room, RoomStatus } from "@/types";
import { CheckCircle, User } from "lucide-react";

type RoomInfoCardProps = {
  room: Room;
};

const RoomInfoCard: React.FC<RoomInfoCardProps> = ({ room }) => {
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

  return (
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
  );
};

export default RoomInfoCard;
