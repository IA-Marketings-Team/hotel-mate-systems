
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NewBookingForm } from "@/components/bookings/NewBookingForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DateRange } from "react-day-picker";
import { BookingType } from "@/types/bookings";
import { AppLayout } from "@/components/layout/AppLayout";

const bookingSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  resourceId: z.string().min(1, "Veuillez sélectionner une ressource"),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }),
  amount: z.coerce.number().min(0, "Le montant doit être positif"),
  extras: z.array(z.any()).optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const NewBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookingTypeParam = searchParams.get('type') as BookingType || 'room';
  
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
    },
  });

  const handleCancel = () => {
    navigate("/bookings");
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
          <NewBookingForm 
            form={form} 
            dateRange={dateRange}
            setDateRange={setDateRange}
            bookingType={bookingTypeParam}
            onOpenChange={handleCancel}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewBooking;
