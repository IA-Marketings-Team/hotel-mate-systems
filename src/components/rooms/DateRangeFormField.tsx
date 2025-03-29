
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
import { differenceInDays } from "date-fns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

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
  
  const handleFromDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    let toDate = dateRange.to;
    
    // Si la date de début est après la date de fin ou si la date de fin n'est pas définie
    if (!toDate || date > toDate) {
      const newToDate = new Date(date);
      newToDate.setDate(newToDate.getDate() + 1);
      toDate = newToDate;
    }
    
    setDateRange({
      from: date,
      to: toDate
    });
  };
  
  const handleToDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    const fromDate = dateRange.from || new Date();
    
    // Si la date de fin est avant la date de début
    if (date < fromDate) {
      return;
    }
    
    setDateRange({
      from: fromDate,
      to: date
    });
  };
  
  const today = new Date();

  return (
    <div className="space-y-4">
      {/* Champ de date de début */}
      <FormField
        control={form.control}
        name="fromDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date d'arrivée</FormLabel>
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
                      <span>Sélectionner la date d'arrivée</span>
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
            <FormLabel>Date de départ</FormLabel>
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
                      <span>Sélectionner la date de départ</span>
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
      
      <p className="text-sm text-muted-foreground">
        Durée: {calculateNights()} nuit(s)
      </p>
    </div>
  );
};
