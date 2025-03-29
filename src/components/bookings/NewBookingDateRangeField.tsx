
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
  
  const handleFromDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    let toDate = dateRange.to;
    
    // Si la date de début est après la date de fin ou si la date de fin n'est pas définie
    if (!toDate || date > toDate) {
      if (bookingType === 'room' || bookingType === 'car') {
        // Pour les chambres et voitures, ajouter 1 jour
        const newToDate = new Date(date);
        newToDate.setDate(newToDate.getDate() + 1);
        toDate = newToDate;
      } else {
        // Pour les autres ressources, ajouter 2 heures
        const newToDate = new Date(date);
        newToDate.setHours(newToDate.getHours() + 2);
        toDate = newToDate;
      }
    }
    
    setDateRange({
      from: date,
      to: toDate
    });
  };
  
  const handleToDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    const fromDate = dateRange.from || today;
    
    // Si la date de fin est avant la date de début
    if (date < fromDate) {
      return;
    }
    
    setDateRange({
      from: fromDate,
      to: date
    });
  };
  
  const getStartDateLabel = () => {
    switch (bookingType) {
      case 'room':
        return "Date d'arrivée";
      case 'car':
        return "Date de début de location";
      case 'meeting':
        return "Date de la réunion";
      case 'terrace':
      case 'restaurant':
        return "Date de la réservation";
      default:
        return "Date de début";
    }
  };
  
  const getEndDateLabel = () => {
    switch (bookingType) {
      case 'room':
        return "Date de départ";
      case 'car':
        return "Date de fin de location";
      case 'meeting':
        return "Fin de la réunion";
      case 'terrace':
      case 'restaurant':
        return "Fin de la réservation";
      default:
        return "Date de fin";
    }
  };
  
  const getFromDatePlaceholder = () => {
    switch (bookingType) {
      case 'room':
        return "Sélectionner la date d'arrivée";
      case 'car':
        return "Sélectionner la date de début";
      default:
        return "Sélectionner une date";
    }
  };
  
  const getToDatePlaceholder = () => {
    switch (bookingType) {
      case 'room':
        return "Sélectionner la date de départ";
      case 'car':
        return "Sélectionner la date de fin";
      default:
        return "Sélectionner une date";
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Champ de date de début */}
      <FormField
        control={form.control}
        name="fromDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{getStartDateLabel()}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      format(dateRange.from, "PPP", { locale: fr })
                    ) : (
                      <span>{getFromDatePlaceholder()}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  defaultMonth={dateRange.from}
                  selected={dateRange.from}
                  onSelect={handleFromDateChange}
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
      
      {/* Champ de date de fin */}
      <FormField
        control={form.control}
        name="toDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{getEndDateLabel()}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? (
                      format(dateRange.to, "PPP", { locale: fr })
                    ) : (
                      <span>{getToDatePlaceholder()}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start">
                <Calendar
                  initialFocus
                  mode="single"
                  defaultMonth={dateRange.to}
                  selected={dateRange.to}
                  onSelect={handleToDateChange}
                  numberOfMonths={1}
                  locale={fr}
                  fromDate={dateRange.from || today}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
