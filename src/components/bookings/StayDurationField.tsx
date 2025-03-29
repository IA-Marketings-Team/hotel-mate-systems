
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { differenceInDays, differenceInHours } from "date-fns";
import {
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { StayDurationInfo } from "./StayDurationInfo";
import { BookingType } from "@/types/bookings";

interface StayDurationFieldProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  roomPrice?: number;
  bookingType: BookingType;
}

export const StayDurationField: React.FC<StayDurationFieldProps> = ({
  form,
  dateRange,
  roomPrice,
  bookingType
}) => {
  const getDuration = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    
    if (bookingType === 'room' || bookingType === 'car') {
      // For rooms and cars, use days
      return Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    } else {
      // For other resources, use hours
      return Math.max(1, differenceInHours(dateRange.to, dateRange.from));
    }
  };

  const duration = getDuration();
  
  return (
    <FormItem className="space-y-2">
      <FormLabel>
        {bookingType === 'room' || bookingType === 'car' 
          ? 'Durée du séjour' 
          : 'Durée de réservation'}
      </FormLabel>
      <StayDurationInfo 
        dateRange={dateRange} 
        roomPrice={roomPrice} 
        bookingType={bookingType}
      />
      <input 
        type="hidden" 
        name="stayDuration" 
        value={duration} 
        onChange={() => {}}
      />
    </FormItem>
  );
};
