
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import {
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { StayDurationInfo } from "./StayDurationInfo";

interface StayDurationFieldProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  roomPrice?: number;
}

export const StayDurationField: React.FC<StayDurationFieldProps> = ({
  form,
  dateRange,
  roomPrice
}) => {
  const nights = dateRange.from && dateRange.to 
    ? Math.max(1, differenceInDays(dateRange.to, dateRange.from))
    : 0;
    
  return (
    <FormItem className="space-y-2">
      <FormLabel>Durée du séjour</FormLabel>
      <StayDurationInfo dateRange={dateRange} roomPrice={roomPrice} />
      <input 
        type="hidden" 
        name="stayDuration" 
        value={nights} 
        onChange={() => {}}
      />
    </FormItem>
  );
};
