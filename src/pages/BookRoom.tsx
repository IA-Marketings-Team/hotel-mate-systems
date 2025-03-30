
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useClients } from "@/hooks/useClients";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRooms } from "@/hooks/useRooms";
import { ClientFormField } from "@/components/rooms/ClientFormField";
import { DateRangeFormField } from "@/components/rooms/DateRangeFormField";
import { RoomExtrasSelector } from "@/components/rooms/RoomExtrasSelector";
import { BookingDetails } from "@/components/rooms/BookingDetails";
import { useInvoices } from "@/hooks/useInvoices";
import { ChevronLeft } from "lucide-react";

const bookingFormSchema = z.object({
  clientId: z.string().min(1, "La sélection d'un client est requise"),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookRoom = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rooms, loading, error, bookRoom } = useRooms();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { createInvoice } = useInvoices();
  const [room, setRoom] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<RoomExtra[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      clientId: "",
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1))
      }
    },
  });

  useEffect(() => {
    if (!loading && rooms.length > 0 && id) {
      const foundRoom = rooms.find(r => r.id === id);
      setRoom(foundRoom || null);
    }
  }, [id, rooms, loading]);

  useEffect(() => {
    form.setValue("dateRange", dateRange);
  }, [dateRange, form]);

  // Calculate nights based on date range
  const calculateNights = () => {
    if (dateRange?.from && dateRange?.to) {
      return Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    }
    return 1;
  };

  // Calculate total price including extras and duration
  const calculateTotalPrice = () => {
    if (!room) return 0;
    const nights = calculateNights();
    const roomTotal = room.pricePerNight * nights;
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
    return roomTotal + extrasTotal;
  };

  const handleSubmit = async (data: BookingFormValues) => {
    if (!room) return;
    
    const selectedClient = clients?.find(client => client.id === data.clientId);
    if (selectedClient) {
      setIsSubmitting(true);
      try {
        await bookRoom(room.id, selectedClient.name, selectedClient.id, selectedExtras, dateRange);
        form.reset();
        
        // Build extras description for invoice
        const extrasDescription = selectedExtras
          .filter(extra => extra.quantity > 0)
          .map(extra => `${extra.quantity}x ${extra.name}`)
          .join(", ");
        
        const description = `Réservation Chambre ${room.number} pour ${calculateNights()} nuit(s)${extrasDescription ? ` (${extrasDescription})` : ""}`;
        const totalAmount = calculateTotalPrice();
        
        // Create invoice - REMOVED the type property
        await createInvoice.mutateAsync({
          description,
          amount: totalAmount,
          clientId: selectedClient.id,
          staffId: null,
          category: "Chambres",
          subcategory: "Réservations",
          registerType: "hotel"
        });
        
        toast.success(`Chambre ${room.number} réservée pour ${selectedClient.name}`, {
          description: "Une facture a été créée. Vous pouvez effectuer le paiement ultérieurement."
        });
        
        // Navigate back to room details
        setTimeout(() => {
          navigate(`/room/${room.id}`);
        }, 1500);
      } catch (error) {
        console.error("Error booking room:", error);
        toast.error("Erreur lors de la réservation de la chambre");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading || !room) {
    return (
      <AppLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Chargement...</h1>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate(`/room/${room.id}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Réserver la chambre {room.number}</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Détails de la chambre</h2>
              <p><span className="font-medium">Type:</span> {room.type}</p>
              <p><span className="font-medium">Capacité:</span> {room.capacity} personnes</p>
              <p><span className="font-medium">Prix par nuit:</span> {room.pricePerNight}€</p>
              <p><span className="font-medium">Vue:</span> {room.view}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <h2 className="text-lg font-medium mb-4">Informations de réservation</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <ClientFormField form={form} clientsLoading={clientsLoading} clients={clients} />
              <DateRangeFormField form={form} dateRange={dateRange} setDateRange={setDateRange} />

              <Separator />
              
              <RoomExtrasSelector 
                extras={selectedExtras} 
                onChange={setSelectedExtras} 
              />

              <BookingDetails 
                roomPrice={room.pricePerNight} 
                calculateNights={calculateNights} 
                selectedExtras={selectedExtras}
                calculateTotalPrice={calculateTotalPrice} 
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "En cours..." : "Confirmer la réservation"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default BookRoom;
