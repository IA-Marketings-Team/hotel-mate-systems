
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
import { formatCurrency } from "@/lib/utils";

interface NewBookingAmountFieldProps {
  form: UseFormReturn<any>;
  showFormattedAmount?: boolean;
  label?: string;
}

export const NewBookingAmountField: React.FC<NewBookingAmountFieldProps> = ({
  form,
  showFormattedAmount = false,
  label = "Montant total (€)"
}) => {
  const amount = form.watch("amount");
  const formattedAmount = formatCurrency(parseFloat(amount) || 0);
  
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="number" min="0" step="0.01" {...field} />
          </FormControl>
          {showFormattedAmount && amount && (
            <div className="text-sm text-muted-foreground mt-1">
              {formattedAmount}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
