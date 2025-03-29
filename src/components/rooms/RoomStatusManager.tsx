
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle, User } from "lucide-react";
import { Room } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RoomStatusManagerProps = {
  room: Room;
  onMakeAvailable: () => Promise<void>;
  onOpenBookingDialog: () => void;
  onToggleMaintenance: (checked: boolean) => Promise<void>;
  onToggleCleaning: (checked: boolean) => Promise<void>;
};

const RoomStatusManager: React.FC<RoomStatusManagerProps> = ({
  room,
  onMakeAvailable,
  onOpenBookingDialog,
  onToggleMaintenance,
  onToggleCleaning,
}) => {
  return (
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
                onClick={onMakeAvailable}
              >
                <CheckCircle className="h-4 w-4 mr-1" /> Disponible
              </Button>
              
              <Button
                variant={room.status === 'occupied' ? 'default' : 'outline'} 
                className={room.status === 'occupied' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                onClick={onOpenBookingDialog}
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
                  onCheckedChange={onToggleMaintenance}
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
                  onCheckedChange={onToggleCleaning}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomStatusManager;
