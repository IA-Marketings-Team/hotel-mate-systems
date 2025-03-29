
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useClients } from "@/hooks/useClients";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "sonner";
import { BookingType } from "@/types/bookings";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { NewBookingClientField } from "./NewBookingClientField";
import { NewBookingGuestField } from "./NewBookingGuestField";
import { NewBookingResourceField } from "./NewBookingResourceField";
import { NewBookingDateRangeField } from "./NewBookingDateRangeField";
import { NewBookingAmountField } from "./NewBookingAmountField";
import { NewBookingExtrasField } from "./NewBookingExtrasField";

interface NewBookingFormProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  bookingType: BookingType;
  onOpenChange: (open: boolean) => void;
}

export const NewBookingForm: React.FC<NewBookingFormProps> = ({
  form,
  dateRange,
  setDateRange,
  bookingType,
  onOpenChange
}) => {
  const { data: clients } = useClients();
  const { rooms } = useRooms();
  const { createBooking } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update dateRange in form when it changes
  useEffect(() => {
    form.setValue("dateRange", dateRange);
  }, [dateRange, form]);

  // When resource changes, update amount based on the selected room and duration
  useEffect(() => {
    const resourceId = form.watch("resourceId");
    const currentDateRange = form.watch("dateRange");
    
    if (resourceId && bookingType === "room" && currentDateRange?.from && currentDateRange?.to) {
      const selectedRoom = rooms.find(room => room.id === resourceId);
      if (selectedRoom) {
        const nights = differenceInDays(currentDateRange.to, currentDateRange.from) || 1;
        form.setValue("amount", selectedRoom.pricePerNight * nights);
      }
    }
  }, [form.watch("resourceId"), form.watch("dateRange"), rooms, bookingType, form]);

  // When client changes, update the guest name
  useEffect(() => {
    const clientId = form.watch("clientId");
    if (clientId) {
      const selectedClient = clients?.find(client => client.id === clientId);
      if (selectedClient) {
        form.setValue("guestName", selectedClient.name);
      }
    }
  }, [form.watch("clientId"), clients, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createBooking({
        resourceId: data.resourceId,
        roomId: bookingType === 'room' ? data.resourceId : undefined,
        guestName: data.guestName,
        clientId: data.clientId,
        checkIn: data.dateRange.from,
        checkOut: data.dateRange.to,
        amount: data.amount,
        status: 'confirmed',
        createdBy: 'Admin',
        bookingType,
        extras: data.extras,
      });
      
      onOpenChange(false);
      toast.success("Réservation créée avec succès");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResourceOptions = () => {
    if (bookingType === 'room') {
      return rooms
        .filter(room => room.status === 'available' && !room.maintenanceStatus)
        .map(room => ({
          value: room.id,
          label: `Chambre ${room.number} (${room.type}) - ${room.pricePerNight}€/nuit`
        }));
    }
    
    // For other resource types, we'd need to implement fetching those resources
    return [{
      value: "placeholder",
      label: `Option ${bookingType} (à implémenter)`
    }];
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NewBookingClientField form={form} clients={clients} />
        <NewBookingGuestField form={form} />
        <NewBookingResourceField 
          form={form} 
          resourceOptions={getResourceOptions()} 
          bookingType={bookingType} 
        />
        <NewBookingDateRangeField 
          form={form} 
          dateRange={dateRange} 
          setDateRange={setDateRange} 
          rooms={rooms}
          bookingType={bookingType}
        />
        <NewBookingAmountField form={form} />
        
        {bookingType === 'room' && (
          <NewBookingExtrasField form={form} rooms={rooms} />
        )}

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
