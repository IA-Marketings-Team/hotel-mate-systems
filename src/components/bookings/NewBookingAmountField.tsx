
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

interface NewBookingAmountFieldProps {
  form: UseFormReturn<any>;
}

export const NewBookingAmountField: React.FC<NewBookingAmountFieldProps> = ({
  form
}) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Montant total (€)</FormLabel>
          <FormControl>
            <Input type="number" min="0" step="0.01" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
