
import React from "react";
import { DateRange } from "react-day-picker";
import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface StayDurationInfoProps {
  dateRange: DateRange;
  roomPrice?: number;
}

export const StayDurationInfo: React.FC<StayDurationInfoProps> = ({
  dateRange,
  roomPrice
}) => {
  if (!dateRange.from || !dateRange.to) return null;
  
  const nights = Math.max(1, differenceInDays(dateRange.to, dateRange.from));
  const totalPrice = roomPrice ? roomPrice * nights : undefined;
  
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4 flex flex-col space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <CalendarDays className="h-4 w-4" />
          <span className="font-medium">Détails du séjour</span>
        </div>
        
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span>Arrivée:</span>
            <span className="font-medium">
              {format(dateRange.from, "PPP", { locale: fr })}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Départ:</span>
            <span className="font-medium">
              {format(dateRange.to, "PPP", { locale: fr })}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Durée:</span>
            <span>{nights} nuit{nights > 1 ? 's' : ''}</span>
          </div>
          
          {roomPrice && (
            <div className="mt-2 pt-2 border-t flex justify-between">
              <span>Prix total:</span>
              <span className="font-medium">{totalPrice}€</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
