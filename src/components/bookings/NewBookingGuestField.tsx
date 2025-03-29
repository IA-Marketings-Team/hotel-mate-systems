
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface NewBookingGuestFieldProps {
  form: UseFormReturn<any>;
}

export const NewBookingGuestField: React.FC<NewBookingGuestFieldProps> = ({
  form
}) => {
  return (
    <FormField
      control={form.control}
      name="guestName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom du client</FormLabel>
          <FormControl>
            <Input placeholder="Nom du client" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
