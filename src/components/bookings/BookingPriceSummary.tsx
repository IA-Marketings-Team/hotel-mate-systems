
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";

interface BookingPriceSummaryProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  roomPrice: number;
  extras?: RoomExtra[];
}

export const BookingPriceSummary: React.FC<BookingPriceSummaryProps> = ({
  form,
  dateRange,
  roomPrice,
  extras = []
}) => {
  const calculateTotal = () => {
    if (!dateRange.from || !dateRange.to) return roomPrice;
    
    const nights = Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    const roomTotal = roomPrice * nights;
    
    const extrasTotal = extras
      ? extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0)
      : 0;
      
    return roomTotal + extrasTotal;
  };
  
  useEffect(() => {
    form.setValue("amount", calculateTotal());
  }, [dateRange, extras, roomPrice]);
  
  return (
    <Card className="bg-primary/10 mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="font-medium">Montant total</span>
          </div>
          <span className="text-lg font-bold">{calculateTotal()}€</span>
        </div>
      </CardContent>
    </Card>
  );
};
