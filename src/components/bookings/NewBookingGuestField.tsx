
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
  readonly?: boolean;
}

export const NewBookingGuestField: React.FC<NewBookingGuestFieldProps> = ({
  form,
  readonly = false
}) => {
  return (
    <FormField
      control={form.control}
      name="guestName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom du client</FormLabel>
          <FormControl>
            <Input 
              placeholder="Nom du client" 
              {...field} 
              readOnly={readonly}
              className={readonly ? "bg-gray-100" : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
