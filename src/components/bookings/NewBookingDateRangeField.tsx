
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
import { format, addDays } from "date-fns";
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
  
  const handleRangeChange = (range: DateRange) => {
    if (range.from && !range.to) {
      // Quand seulement la date de début est sélectionnée, 
      // ajoutons automatiquement 1 jour ou 2 heures pour la date de fin
      let toDate;
      
      if (bookingType === 'room' || bookingType === 'car') {
        // Pour les chambres et voitures, on ajoute 1 jour
        toDate = addDays(range.from, 1);
      } else {
        // Pour les autres ressources, on ajoute 2 heures
        toDate = new Date(range.from);
        toDate.setHours(toDate.getHours() + 2);
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
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleRangeChange}
                numberOfMonths={1}
                locale={fr}
                fromDate={today}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
