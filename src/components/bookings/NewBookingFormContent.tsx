
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { BookingType } from "@/types/bookings";
import { DateRange } from "react-day-picker";
import { NewBookingClientField } from "./NewBookingClientField";
import { NewBookingResourceField } from "./NewBookingResourceField";
import { NewBookingAmountField } from "./NewBookingAmountField";
import { NewBookingExtrasField } from "./NewBookingExtrasField";
import { StayDurationField } from "./StayDurationField";
import { BookingPriceSummary } from "./BookingPriceSummary";
import { NewBookingDateFields } from "./NewBookingDateFields";

interface NewBookingFormContentProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  bookingType: BookingType;
  onOpenChange: (open: boolean) => void;
  clientOptions: { value: string; label: string }[];
  resourceOptions: { value: string; label: string }[];
  selectedResourcePrice: number;
  extras: any[];
  setExtras: (extras: any[]) => void;
  isSubmitting: boolean;
  rooms?: any[];
  onSubmit: (data: any) => Promise<void>;
}

export const NewBookingFormContent: React.FC<NewBookingFormContentProps> = ({
  form,
  dateRange,
  setDateRange,
  bookingType,
  onOpenChange,
  clientOptions,
  resourceOptions,
  selectedResourcePrice,
  extras,
  setExtras,
  isSubmitting,
  rooms,
  onSubmit
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NewBookingClientField 
          form={form} 
          clients={clientOptions}
        />
        
        <NewBookingResourceField 
          form={form} 
          resourceOptions={resourceOptions} 
          bookingType={bookingType} 
        />
        
        <NewBookingDateFields
          form={form}
          dateRange={dateRange}
          setDateRange={setDateRange}
          bookingType={bookingType}
        />
        
        <StayDurationField 
          form={form} 
          dateRange={dateRange} 
          roomPrice={selectedResourcePrice}
          bookingType={bookingType}
        />
        
        {bookingType === 'room' && rooms && (
          <NewBookingExtrasField 
            form={form} 
            rooms={rooms}
            onChange={setExtras}
          />
        )}
        
        <NewBookingAmountField form={form} />
        
        <BookingPriceSummary
          form={form}
          dateRange={dateRange}
          roomPrice={selectedResourcePrice}
          extras={extras}
          bookingType={bookingType}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer la réservation"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
