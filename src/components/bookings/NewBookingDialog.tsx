
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingType } from "@/types/bookings";
import { DateRange } from "react-day-picker";
import { NewBookingForm } from "./NewBookingForm";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réservation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle réservation en remplissant le formulaire ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <NewBookingForm 
          form={form} 
          dateRange={dateRange}
          setDateRange={setDateRange}
          bookingType={bookingType}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingDialog;
