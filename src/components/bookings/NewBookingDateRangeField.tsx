
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { BookingType } from "@/types/bookings";

interface NewBookingDateRangeFieldProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  rooms: any[];
  bookingType: BookingType;
}

export const NewBookingDateRangeField: React.FC<NewBookingDateRangeFieldProps> = ({
  form,
  dateRange,
  setDateRange,
  rooms,
  bookingType
}) => {
  // Calculate nights for display
  const calculateNights = () => {
    if (dateRange?.from && dateRange?.to) {
      return Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    }
    return 1;
  };

  return (
    <FormField
      control={form.control}
      name="dateRange"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Période de séjour</FormLabel>
          <DatePickerWithRange 
            dateRange={dateRange} 
            onDateRangeChange={(range) => {
              if (range?.from && range?.to) {
                setDateRange(range);
                field.onChange(range);
                
                // Update amount based on new date range if a room is selected
                const resourceId = form.getValues("resourceId");
                if (resourceId && bookingType === "room") {
                  const selectedRoom = rooms.find(room => room.id === resourceId);
                  if (selectedRoom) {
                    const nights = differenceInDays(range.to, range.from) || 1;
                    form.setValue("amount", selectedRoom.pricePerNight * nights);
                  }
                }
              }
            }} 
          />
          <p className="text-sm text-muted-foreground mt-1">
            Durée: {calculateNights()} nuit(s)
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
