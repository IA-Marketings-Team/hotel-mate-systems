
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "sonner";
import { BookingType } from "@/types/bookings";
import { RoomExtrasSelector } from "@/components/rooms/RoomExtrasSelector";

interface NewBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingType: BookingType;
}

const bookingSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  resourceId: z.string().min(1, "Veuillez sélectionner une ressource"),
  guestName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  checkIn: z.date({
    required_error: "Veuillez sélectionner une date d'arrivée",
  }),
  checkOut: z.date({
    required_error: "Veuillez sélectionner une date de départ",
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
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientId: "",
      resourceId: "",
      guestName: "",
      checkIn: new Date(),
      checkOut: addDays(new Date(), 1),
      amount: 0,
      extras: [],
    },
  });

  // Reset the form when the dialog opens or booking type changes
  useEffect(() => {
    if (open) {
      form.reset({
        clientId: "",
        resourceId: "",
        guestName: "",
        checkIn: new Date(),
        checkOut: addDays(new Date(), 1),
        amount: 0,
        extras: [],
      });
    }
  }, [open, bookingType, form]);

  // When resourceId changes, update the amount based on the selected room
  useEffect(() => {
    const resourceId = form.watch("resourceId");
    if (resourceId && bookingType === "room") {
      const selectedRoom = rooms.find(room => room.id === resourceId);
      if (selectedRoom) {
        form.setValue("amount", selectedRoom.pricePerNight);
      }
    }
  }, [form.watch("resourceId"), rooms, bookingType, form]);

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
        checkIn: data.checkIn,
        checkOut: data.checkOut,
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'arrivée</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de départ</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= form.getValues("checkIn")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant (€)</FormLabel>
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
                    <RoomExtrasSelector
                      extras={field.value || []}
                      onChange={field.onChange}
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
