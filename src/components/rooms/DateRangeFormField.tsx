
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

interface DateRangeFormFieldProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

export const DateRangeFormField: React.FC<DateRangeFormFieldProps> = ({
  form,
  dateRange,
  setDateRange
}) => {
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
              setDateRange(range);
              field.onChange(range);
            }} 
          />
          <p className="text-sm text-muted-foreground">
            Durée: {calculateNights()} nuit(s)
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
