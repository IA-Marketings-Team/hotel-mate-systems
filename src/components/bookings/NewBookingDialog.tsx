
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/useClients";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "sonner";
import { BookingType } from "@/types/bookings";
import { RoomExtrasSelector } from "@/components/rooms/RoomExtrasSelector";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingType: BookingType;
}

const bookingSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  resourceId: z.string().min(1, "Veuillez sélectionner une ressource"),
  guestName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }),
  amount: z.coerce.number().min(0, "Le montant doit être positif"),
  extras: z.array(z.any()).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const NewBookingDialog: React.FC<NewBookingDialogProps> = ({
  open,
  onOpenChange,
  bookingType,
}) => {
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { rooms } = useRooms();
  const { createBooking } = useBookings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientId: "",
      resourceId: "",
      guestName: "",
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1))
      },
      amount: 0,
      extras: [],
    },
  });

  // Reset the form when the dialog opens or booking type changes
  useEffect(() => {
    if (open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      form.reset({
        clientId: "",
        resourceId: "",
        guestName: "",
        dateRange: {
          from: new Date(),
          to: tomorrow
        },
        amount: 0,
        extras: [],
      });
      
      setDateRange({
        from: new Date(),
        to: tomorrow
      });
    }
  }, [open, bookingType, form]);

  // When resourceId changes, update the amount based on the selected room and duration
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

  // Update dateRange in form when it changes
  useEffect(() => {
    form.setValue("dateRange", dateRange);
  }, [dateRange, form]);

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

  const onSubmit = async (data: BookingFormValues) => {
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
    // For now, return a placeholder
    return [{
      value: "placeholder",
      label: `Option ${bookingType} (à implémenter)`
    }];
  };

  const resourceOptions = getResourceOptions();
  
  // Calculate nights for display
  const calculateNights = () => {
    if (dateRange?.from && dateRange?.to) {
      return Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    }
    return 1;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle réservation en remplissant le formulaire ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resourceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {bookingType === 'room' ? 'Chambre' : 'Ressource'}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Sélectionner une ${bookingType === 'room' ? 'chambre' : 'ressource'}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resourceOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Période de séjour</FormLabel>
                  <DatePickerWithRange 
                    dateRange={dateRange} 
                    onDateRangeChange={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange(range);
                        field.onChange(range);
                        
                        // Update amount based on new date range if a room is selected
                        const resourceId = form.getValues("resourceId");
                        if (resourceId && bookingType === "room") {
                          const selectedRoom = rooms.find(room => room.id === resourceId);
                          if (selectedRoom) {
                            const nights = differenceInDays(range.to, range.from) || 1;
                            form.setValue("amount", selectedRoom.pricePerNight * nights);
                          }
                        }
                      }
                    }} 
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Durée: {calculateNights()} nuit(s)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant total (€)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {bookingType === 'room' && (
              <FormField
                control={form.control}
                name="extras"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extras</FormLabel>
                    <RoomExtrasSelector
                      extras={field.value || []}
                      onChange={(extras) => {
                        field.onChange(extras);
                        
                        // Recalculate total price when extras change
                        const resourceId = form.getValues("resourceId");
                        const currentDateRange = form.getValues("dateRange");
                        if (resourceId && currentDateRange?.from && currentDateRange?.to) {
                          const selectedRoom = rooms.find(room => room.id === resourceId);
                          if (selectedRoom) {
                            const nights = differenceInDays(currentDateRange.to, currentDateRange.from) || 1;
                            const roomPrice = selectedRoom.pricePerNight * nights;
                            const extrasPrice = extras
                              .filter(extra => extra.quantity > 0)
                              .reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
                            form.setValue("amount", roomPrice + extrasPrice);
                          }
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingDialog;
