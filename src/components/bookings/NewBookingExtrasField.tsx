
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RoomExtrasSelector } from "@/components/rooms/RoomExtrasSelector";
import { differenceInDays } from "date-fns";

interface NewBookingExtrasFieldProps {
  form: UseFormReturn<any>;
  rooms: any[];
}

export const NewBookingExtrasField: React.FC<NewBookingExtrasFieldProps> = ({
  form,
  rooms
}) => {
  return (
    <FormField
      control={form.control}
      name="extras"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Extras</FormLabel>
          <RoomExtrasSelector
            extras={field.value || []}
            onChange={(extras) => {
              field.onChange(extras);
              
              // Recalculate total price when extras change
              const resourceId = form.getValues("resourceId");
              const currentDateRange = form.getValues("dateRange");
              if (resourceId && currentDateRange?.from && currentDateRange?.to) {
                const selectedRoom = rooms.find(room => room.id === resourceId);
                if (selectedRoom) {
                  const nights = differenceInDays(currentDateRange.to, currentDateRange.from) || 1;
                  const roomPrice = selectedRoom.pricePerNight * nights;
                  const extrasPrice = extras
                    .filter(extra => extra.quantity > 0)
                    .reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
                  form.setValue("amount", roomPrice + extrasPrice);
                }
              }
            }}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
