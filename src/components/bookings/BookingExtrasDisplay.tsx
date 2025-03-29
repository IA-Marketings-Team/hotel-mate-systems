
import React from "react";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

interface BookingExtrasDisplayProps {
  extras: RoomExtra[];
}

export const BookingExtrasDisplay: React.FC<BookingExtrasDisplayProps> = ({
  extras
}) => {
  if (!extras || extras.length === 0) return null;
  
  const selectedExtras = extras.filter(extra => extra.quantity > 0);
  if (selectedExtras.length === 0) return null;
  
  const calculateExtrasTotal = () => {
    return selectedExtras.reduce((total, extra) => {
      return total + (extra.price * extra.quantity);
    }, 0);
  };
  
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4 flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Package className="h-4 w-4" />
          <span className="font-medium">Services supplémentaires</span>
        </div>
        
        <div className="text-sm space-y-1">
          {selectedExtras.map(extra => (
            <div key={extra.id} className="flex justify-between">
              <span>{extra.quantity}x {extra.name}</span>
              <span className="font-medium">{extra.price * extra.quantity}€</span>
            </div>
          ))}
          
          <div className="mt-2 pt-2 border-t flex justify-between">
            <span>Total extras:</span>
            <span className="font-medium">{calculateExtrasTotal()}€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
