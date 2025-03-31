
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useClients } from "@/hooks/useClients";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "sonner";
import { BookingType } from "@/types/bookings";
import { DateRange } from "react-day-picker";
import { differenceInDays, differenceInHours } from "date-fns";
import { useResources } from "@/hooks/useResources";
import { NewBookingFormContent } from "./NewBookingFormContent";

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

  useEffect(() => {
    form.setValue("dateRange", dateRange);
  }, [dateRange, form]);

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
      const days = differenceInDays(currentDateRange.to, currentDateRange.from) || 1;
      price = bookingType === "room" 
        ? (selectedResource.pricePerNight || 0) * days
        : (selectedResource.pricePerHour || 0) * days;
    } else {
      const hours = differenceInHours(currentDateRange.to, currentDateRange.from) || 1;
      price = (selectedResource.pricePerHour || 0) * hours;
    }
    
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
      const selectedClient = clients?.find(client => client.id === data.clientId);
      if (!selectedClient) {
        toast.error("Client non trouvé");
        setIsSubmitting(false);
        return;
      }
      
      const guestName = selectedClient.name;
      
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
        onSuccess({
          clientId: data.clientId,
          clientName: guestName,
          resourceId: data.resourceId,
          resourceName,
          dateRange: data.dateRange,
          amount: data.amount,
          extras: data.extras,
          bookingId: bookingResult?.id,
          type: "payment"
        });
      } else {
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

  const clientOptions = clients ? clients.map(client => ({
    value: client.id,
    label: client.name
  })) : [];

  const resourceOptions = getResourceOptions();
  const selectedResourcePrice = getSelectedResourcePrice();

  return (
    <NewBookingFormContent
      form={form}
      dateRange={dateRange}
      setDateRange={setDateRange}
      bookingType={bookingType}
      onOpenChange={onOpenChange}
      clientOptions={clientOptions}
      resourceOptions={resourceOptions}
      selectedResourcePrice={selectedResourcePrice}
      extras={extras}
      setExtras={setExtras}
      isSubmitting={isSubmitting}
      rooms={rooms}
      onSubmit={onSubmit}
    />
  );
};
