
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RoomExtrasSelector, RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { differenceInDays } from "date-fns";

interface NewBookingExtrasFieldProps {
  form: UseFormReturn<any>;
  rooms: any[];
  onChange?: (extras: RoomExtra[]) => void;
}

export const NewBookingExtrasField: React.FC<NewBookingExtrasFieldProps> = ({
  form,
  rooms,
  onChange
}) => {
  const handleExtrasChange = (extras: RoomExtra[]) => {
    // Update form with new extras
    form.setValue("extras", extras);
    
    // Notify parent component if onChange callback is provided
    if (onChange) {
      onChange(extras);
    }
    
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
  };

  // Initialize extras from form when component mounts
  useEffect(() => {
    const currentExtras = form.getValues("extras") || [];
    if (onChange && currentExtras.length > 0) {
      onChange(currentExtras);
    }
  }, []);

  return (
    <FormField
      control={form.control}
      name="extras"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Extras</FormLabel>
          <RoomExtrasSelector
            extras={field.value || []}
            onChange={handleExtrasChange}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
