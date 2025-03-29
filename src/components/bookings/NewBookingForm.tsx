
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
import { differenceInDays, differenceInHours } from "date-fns";
import { NewBookingClientField } from "./NewBookingClientField";
import { NewBookingResourceField } from "./NewBookingResourceField";
import { NewBookingAmountField } from "./NewBookingAmountField";
import { NewBookingExtrasField } from "./NewBookingExtrasField";
import { useResources } from "@/hooks/useResources";
import { StayDurationField } from "./StayDurationField";
import { BookingPriceSummary } from "./BookingPriceSummary";
import { NewBookingDateFields } from "./NewBookingDateFields";

interface NewBookingFormProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  bookingType: BookingType;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (bookingData: any) => void;
}

export const NewBookingForm: React.FC<NewBookingFormProps> = ({
  form,
  dateRange,
  setDateRange,
  bookingType,
  onOpenChange,
  onSuccess
}) => {
  const { data: clients } = useClients();
  const { rooms, loading: roomsLoading } = useRooms();
  const { resources } = useResources(bookingType);
  const { createBooking } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extras, setExtras] = useState<any[]>([]);

  // Update dateRange in form when it changes
  useEffect(() => {
    form.setValue("dateRange", dateRange);
  }, [dateRange, form]);

  // When resource changes, update amount based on the selected resource and duration
  useEffect(() => {
    const resourceId = form.watch("resourceId");
    const currentDateRange = form.watch("dateRange");
    
    if (!resourceId || !currentDateRange?.from || !currentDateRange?.to) return;
    
    let selectedResource;
    
    if (bookingType === "room") {
      selectedResource = rooms.find(room => room.id === resourceId);
    } else {
      selectedResource = resources.find(resource => resource.id === resourceId);
    }
    
    if (!selectedResource) return;
    
    let price = 0;
    
    if (bookingType === "room" || bookingType === "car") {
      // For rooms and cars, calculate by days
      const days = differenceInDays(currentDateRange.to, currentDateRange.from) || 1;
      price = bookingType === "room" 
        ? (selectedResource.pricePerNight || 0) * days
        : (selectedResource.pricePerHour || 0) * days;
    } else {
      // For other resources, calculate by hours
      const hours = differenceInHours(currentDateRange.to, currentDateRange.from) || 1;
      price = (selectedResource.pricePerHour || 0) * hours;
    }
    
    // Add extras if available
    const extrasTotal = extras
      ? extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0)
      : 0;
      
    form.setValue("amount", price + extrasTotal);
  }, [
    form.watch("resourceId"), 
    form.watch("dateRange"), 
    extras, 
    rooms, 
    resources, 
    bookingType, 
    form
  ]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Get the selected client's name for the guestName field
      const selectedClient = clients?.find(client => client.id === data.clientId);
      if (!selectedClient) {
        toast.error("Client non trouvé");
        setIsSubmitting(false);
        return;
      }
      
      const guestName = selectedClient.name;
      
      // Get the resource name for display purposes
      let resourceName = "";
      if (bookingType === "room") {
        const room = rooms.find(r => r.id === data.resourceId);
        resourceName = room ? `${room.number}` : "";
      } else {
        const resource = resources.find(r => r.id === data.resourceId);
        resourceName = resource ? resource.name : "";
      }
      
      const bookingResult = await createBooking({
        resourceId: data.resourceId,
        roomId: bookingType === 'room' ? data.resourceId : undefined,
        guestName: guestName,
        clientId: data.clientId,
        checkIn: data.dateRange.from,
        checkOut: data.dateRange.to,
        amount: data.amount,
        status: 'confirmed',
        createdBy: 'Admin',
        bookingType,
        extras: data.extras,
      });
      
      if (onSuccess) {
        // Pass all relevant data to parent component for payment processing
        onSuccess({
          clientId: data.clientId,
          clientName: guestName,
          resourceId: data.resourceId,
          resourceName,
          dateRange: data.dateRange,
          amount: data.amount,
          extras: data.extras,
          bookingId: bookingResult?.id
        });
      } else {
        // Default success handling if no callback provided
        onOpenChange(false);
        toast.success("Réservation créée avec succès");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Erreur lors de la création de la réservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResourceOptions = () => {
    if (bookingType === 'room') {
      return rooms.filter(room => room.status === 'available').map(room => ({
        value: room.id,
        label: `Chambre ${room.number} (${room.type}) - ${room.pricePerNight}€/nuit`
      }));
    }
    
    // For other resource types
    return resources.map(resource => {
      let priceInfo = '';
      
      if (bookingType === 'car') {
        priceInfo = resource.pricePerHour ? `${resource.pricePerHour}€/jour` : '';
      } else {
        priceInfo = resource.pricePerHour ? `${resource.pricePerHour}€/heure` : '';
      }
      
      return {
        value: resource.id,
        label: `${resource.name} (${resource.capacity} pers.) - ${priceInfo}`
      };
    });
  };

  const getSelectedResourcePrice = () => {
    const resourceId = form.watch("resourceId");
    if (!resourceId) return 0;
    
    if (bookingType === 'room') {
      const room = rooms.find(r => r.id === resourceId);
      return room?.pricePerNight || 0;
    } else {
      const resource = resources.find(r => r.id === resourceId);
      return resource?.pricePerHour || 0;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NewBookingClientField form={form} clients={clients} />
        
        <NewBookingResourceField 
          form={form} 
          resourceOptions={getResourceOptions()} 
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
          roomPrice={getSelectedResourcePrice()}
          bookingType={bookingType}
        />
        
        {bookingType === 'room' && (
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
          roomPrice={getSelectedResourcePrice()}
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
