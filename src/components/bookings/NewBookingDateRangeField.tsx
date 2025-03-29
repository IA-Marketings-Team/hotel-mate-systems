
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, addHours, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const today = new Date();
  
  const getInitialDates = () => {
    const from = today;
    let to;
    
    if (bookingType === 'room' || bookingType === 'car') {
      // For rooms and cars, set initial time range for a day
      to = new Date(from);
      to.setDate(to.getDate() + 1);
    } else {
      // For other resources, set initial time range for 2 hours
      to = addHours(from, 2);
    }
    
    return { from, to };
  };
  
  const handleRangeChange = (range: DateRange) => {
    if (range.from && !range.to) {
      // When only start date is selected, set end date based on booking type
      let toDate;
      
      if (bookingType === 'room' || bookingType === 'car') {
        // For rooms and cars, set end date to the next day
        toDate = new Date(range.from);
        toDate.setDate(toDate.getDate() + 1);
      } else {
        // For other resources, set end time to 2 hours later
        toDate = addHours(range.from, 2);
      }
      
      setDateRange({
        from: range.from,
        to: toDate
      });
    } else {
      setDateRange(range);
    }
  };
  
  const getDatePlaceholder = () => {
    switch (bookingType) {
      case 'room':
        return "Sélectionner les dates de séjour";
      case 'car':
        return "Sélectionner les dates de location";
      case 'meeting':
        return "Sélectionner la date et l'heure de réunion";
      case 'terrace':
      case 'restaurant':
        return "Sélectionner la date et l'heure de réservation";
      default:
        return "Sélectionner des dates";
    }
  };
  
  const getDateLabel = () => {
    switch (bookingType) {
      case 'room':
        return "Dates de séjour";
      case 'car':
        return "Dates de location";
      case 'meeting':
        return "Date et heure de réunion";
      case 'terrace':
      case 'restaurant':
        return "Date et heure de réservation";
      default:
        return "Dates";
    }
  };
  
  return (
    <FormField
      control={form.control}
      name="dateRange"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{getDateLabel()}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP", { locale: fr })} -{" "}
                        {format(dateRange.to, "PPP", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "PPP", { locale: fr })
                    )
                  ) : (
                    <span>{getDatePlaceholder()}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleRangeChange}
                numberOfMonths={2}
                locale={fr}
                fromDate={today}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
