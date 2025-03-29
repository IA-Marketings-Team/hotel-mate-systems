
import React from "react";
import { Separator } from "@/components/ui/separator";
import { RoomExtra } from "./RoomExtrasSelector";

interface BookingDetailsProps {
  roomPrice: number;
  calculateNights: () => number;
  selectedExtras: RoomExtra[];
  calculateTotalPrice: () => number;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({
  roomPrice,
  calculateNights,
  selectedExtras,
  calculateTotalPrice
}) => {
  return (
    <div className="border-t pt-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Prix de la chambre:</span>
          <span>{roomPrice} € x {calculateNights()} nuit(s) = {roomPrice * calculateNights()} €</span>
        </div>
        
        {selectedExtras.filter(e => e.quantity > 0).map(extra => (
          <div key={extra.id} className="flex items-center justify-between">
            <span>{extra.name} (x{extra.quantity}):</span>
            <span>{extra.price * extra.quantity} €</span>
          </div>
        ))}
        
        <Separator />
        
        <div className="flex items-center justify-between font-bold">
          <span>Total:</span>
          <span>{calculateTotalPrice()} €</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Le paiement sera à effectuer à la caisse après confirmation.
      </p>
    </div>
  );
};
