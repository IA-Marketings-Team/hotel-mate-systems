
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/useClients";
import { Skeleton } from "@/components/ui/skeleton";
import { RoomExtra } from "./RoomExtrasSelector";
import { DateRange } from "react-day-picker";
import { BookingFormContainer } from "./BookingFormContainer";
import { BookingDetails } from "./BookingDetails";

export type BookingDialogProps = {
  roomNumber: string;
  roomPrice: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (guestName: string, clientId?: string, extras?: RoomExtra[], dateRange?: DateRange) => Promise<void> | void;
};

const bookingFormSchema = z.object({
  clientId: z.string().min(1, "La sélection d'un client est requise"),
  dateRange: z.object({
    from: z.date(),
    to: z.date()
  }).optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingDialog: React.FC<BookingDialogProps> = ({
  roomNumber,
  roomPrice,
  open,
  onOpenChange,
  onConfirm,
}) => {
  const { data: clients, isLoading: clientsLoading } = useClients();
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
    form.setValue("dateRange", dateRange);
  }, [dateRange, form]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      form.reset({
        clientId: "",
        dateRange: {
          from: new Date(),
          to: tomorrow
        }
      });
      setSelectedExtras([]);
      setDateRange({
        from: new Date(),
        to: tomorrow
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Réserver la chambre {roomNumber}</DialogTitle>
          <DialogDescription>
            Sélectionnez un client pour cette réservation, les dates de séjour et ajoutez des extras si nécessaire.
          </DialogDescription>
        </DialogHeader>

        <BookingFormContainer 
          form={form}
          dateRange={dateRange}
          setDateRange={setDateRange}
          clientsLoading={clientsLoading}
          clients={clients}
          onOpenChange={onOpenChange}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          selectedExtras={selectedExtras} 
          setSelectedExtras={setSelectedExtras}
          roomNumber={roomNumber}
          roomPrice={roomPrice}
          onConfirm={onConfirm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
