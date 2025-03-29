
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingType } from "@/types/bookings";

interface NewBookingResourceFieldProps {
  form: UseFormReturn<any>;
  resourceOptions: { value: string, label: string }[];
  bookingType: BookingType;
}

export const NewBookingResourceField: React.FC<NewBookingResourceFieldProps> = ({
  form,
  resourceOptions,
  bookingType
}) => {
  return (
    <FormField
      control={form.control}
      name="resourceId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {bookingType === 'room' ? 'Chambre' : 'Ressource'}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Sélectionner une ${bookingType === 'room' ? 'chambre' : 'ressource'}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {resourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
