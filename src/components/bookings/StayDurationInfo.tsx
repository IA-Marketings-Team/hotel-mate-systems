
import React from "react";
import { DateRange } from "react-day-picker";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { BookingType } from "@/types/bookings";
import { formatCurrency } from "@/lib/utils";

interface StayDurationInfoProps {
  dateRange: DateRange;
  roomPrice?: number;
  bookingType: BookingType;
}

export const StayDurationInfo: React.FC<StayDurationInfoProps> = ({
  dateRange,
  roomPrice,
  bookingType
}) => {
  if (!dateRange.from || !dateRange.to) {
    return (
      <div className="text-sm text-muted-foreground flex items-center">
        <Calendar className="mr-2 h-4 w-4" />
        <span>Veuillez sélectionner des dates</span>
      </div>
    );
  }

  const formatDate = (date: Date) => format(date, "d MMMM yyyy", { locale: fr });
  
  const getDuration = () => {
    if (bookingType === 'room' || bookingType === 'car') {
      // For rooms and cars, use days
      const nights = Math.max(1, differenceInDays(dateRange.to, dateRange.from));
      return `${nights} ${nights > 1 ? 'nuits' : 'nuit'}`;
    } else {
      // For other resources, use hours
      const hours = Math.max(1, differenceInHours(dateRange.to, dateRange.from));
      return `${hours} ${hours > 1 ? 'heures' : 'heure'}`;
    }
  };
  
  const getDurationLabel = () => {
    switch (bookingType) {
      case 'room':
        return 'nuit(s)';
      case 'car':
        return 'jour(s)';
      case 'meeting':
      case 'terrace':
      case 'restaurant':
        return 'heure(s)';
      default:
        return 'durée';
    }
  };

  const getPriceInfo = () => {
    if (!roomPrice) return null;
    
    if (bookingType === 'room' || bookingType === 'car') {
      const nights = Math.max(1, differenceInDays(dateRange.to, dateRange.from));
      const total = roomPrice * nights;
      return (
        <div className="mt-1 font-medium">
          {formatCurrency(roomPrice)}/{bookingType === 'room' ? 'nuit' : 'jour'} × {nights} {getDurationLabel()} = {formatCurrency(total)}
        </div>
      );
    } else {
      const hours = Math.max(1, differenceInHours(dateRange.to, dateRange.from));
      const total = roomPrice * hours;
      return (
        <div className="mt-1 font-medium">
          {formatCurrency(roomPrice)}/heure × {hours} heures = {formatCurrency(total)}
        </div>
      );
    }
  };
  
  return (
    <div className="text-sm">
      <div className="flex items-center text-muted-foreground">
        <Calendar className="mr-2 h-4 w-4" />
        <span>
          Du {formatDate(dateRange.from)} au {formatDate(dateRange.to)} • {getDuration()}
        </span>
      </div>
      {getPriceInfo()}
    </div>
  );
};
