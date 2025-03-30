import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NewBookingForm } from "@/components/bookings/NewBookingForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateRange } from "react-day-picker";
import { BookingType } from "@/types/bookings";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useInvoices } from "@/hooks/useInvoices";

const bookingSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  resourceId: z.string().min(1, "Veuillez sélectionner une ressource"),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }),
  amount: z.coerce.number().min(0, "Le montant doit être positif"),
  extras: z.array(z.any()).optional(),
  paymentOption: z.enum(['immediate', 'later']),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const NewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookingTypeParam = searchParams.get('type') as BookingType || 'room';
  const { createInvoice } = useInvoices();
  
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 1))
  });
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientId: "",
      resourceId: "",
      dateRange: {
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 1))
      },
      amount: 0,
      extras: [],
      paymentOption: 'immediate',
    },
  });

  const handleCancel = () => {
    navigate("/bookings");
  };

  const handleSuccess = async (bookingData: any) => {
    const { clientId, resourceId, dateRange, amount, extras, resourceName, clientName } = bookingData;
    
    const nights = differenceInDays(dateRange.to, dateRange.from) || 1;
    
    const extrasDescription = extras && extras.length > 0
      ? extras
        .filter((extra: any) => extra.quantity > 0)
        .map((extra: any) => `${extra.quantity}x ${extra.name}`)
        .join(", ")
      : "";
    
    const bookingDescription = bookingTypeParam === 'room'
      ? `Réservation Chambre ${resourceName} pour ${nights} nuit(s)${extrasDescription ? ` (${extrasDescription})` : ""}`
      : `Réservation ${bookingTypeParam === 'meeting' ? 'Salle' : 
         bookingTypeParam === 'car' ? 'Voiture' : 
         bookingTypeParam === 'terrace' ? 'Terrasse' : 'Restaurant'} ${resourceName}`;
    
    try {
      console.log("Creating invoice with data:", {
        description: bookingDescription,
        amount: amount,
        clientId: clientId,
        staffId: null,
        category: bookingTypeParam === 'room' ? "Chambres" : 
                  bookingTypeParam === 'meeting' ? "Salles de réunion" :
                  bookingTypeParam === 'car' ? "Location voitures" :
                  bookingTypeParam === 'terrace' ? "Terrasses" : "Restaurant",
        subcategory: "Réservations",
        registerType: "hotel"
      });
      
      await createInvoice.mutateAsync({
        description: bookingDescription,
        amount: amount,
        clientId: clientId,
        staffId: null,
        category: bookingTypeParam === 'room' ? "Chambres" : 
                  bookingTypeParam === 'meeting' ? "Salles de réunion" :
                  bookingTypeParam === 'car' ? "Location voitures" :
                  bookingTypeParam === 'terrace' ? "Terrasses" : "Restaurant",
        subcategory: "Réservations",
        registerType: "hotel"
      });
      
      toast.success(`Réservation créée pour ${clientName}`, {
        description: "Une facture a été créée. Vous pouvez effectuer le paiement ultérieurement."
      });
      
      setTimeout(() => {
        navigate("/invoices");
      }, 1500);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Erreur lors de la création de la facture");
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Nouvelle réservation</h1>
          <button
            onClick={handleCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Retour aux réservations
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <p className="text-muted-foreground mb-6">
            Créez une nouvelle réservation en remplissant le formulaire ci-dessous.
          </p>
          
          <div className="mb-6 border-b pb-4">
            <h3 className="text-lg font-medium mb-3">Option de paiement</h3>
            <RadioGroup
              defaultValue={form.watch("paymentOption")}
              onValueChange={(value) => form.setValue("paymentOption", value as 'immediate' | 'later')}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="payment-immediate" />
                <Label htmlFor="payment-immediate" className="font-normal">Paiement immédiat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="payment-later" />
                <Label htmlFor="payment-later" className="font-normal">Payer plus tard</Label>
              </div>
            </RadioGroup>
          </div>
          
          <NewBookingForm 
            form={form} 
            dateRange={dateRange}
            setDateRange={setDateRange}
            bookingType={bookingTypeParam}
            onOpenChange={handleCancel}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewBooking;
