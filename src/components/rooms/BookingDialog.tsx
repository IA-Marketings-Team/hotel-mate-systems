
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RoomExtrasSelector, RoomExtra } from "./RoomExtrasSelector";
import { Separator } from "@/components/ui/separator";
import { differenceInDays, differenceInHours } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

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
  const navigate = useNavigate();
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

  // Calculate nights based on date range
  const calculateNights = () => {
    if (dateRange?.from && dateRange?.to) {
      return Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    }
    return 1;
  };

  // Calculate total price including extras and duration
  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const roomTotal = roomPrice * nights;
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
    return roomTotal + extrasTotal;
  };

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

  const handleSubmit = async (data: BookingFormValues) => {
    const selectedClient = clients?.find(client => client.id === data.clientId);
    if (selectedClient) {
      setIsSubmitting(true);
      try {
        await onConfirm(selectedClient.name, selectedClient.id, selectedExtras, dateRange);
        form.reset();
        
        toast.success(`Chambre ${roomNumber} réservée pour ${selectedClient.name}`, {
          description: "Veuillez procéder au paiement à la caisse."
        });
        
        // Build extras description for the payment
        const extrasDescription = selectedExtras
          .filter(extra => extra.quantity > 0)
          .map(extra => `${extra.quantity}x ${extra.name}`)
          .join(", ");
        
        // Navigate to register page for payment
        setTimeout(() => {
          navigate("/registers", { 
            state: { 
              pendingPayment: {
                clientId: selectedClient.id,
                clientName: selectedClient.name,
                description: `Réservation Chambre ${roomNumber} pour ${calculateNights()} nuit(s)${extrasDescription ? ` (${extrasDescription})` : ""}`,
                amount: calculateTotalPrice(),
                category: "Chambres",
                subcategory: "Réservations"
              } 
            } 
          });
        }, 1500);
      } catch (error) {
        console.error("Error booking room:", error);
        toast.error("Erreur lors de la réservation de la chambre");
      } finally {
        setIsSubmitting(false);
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Réserver la chambre {roomNumber}</DialogTitle>
          <DialogDescription>
            Sélectionnez un client pour cette réservation, les dates de séjour et ajoutez des extras si nécessaire.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    {clientsLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
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
                      setDateRange(range);
                      field.onChange(range);
                    }} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Durée: {calculateNights()} nuit(s)
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <RoomExtrasSelector 
              extras={selectedExtras} 
              onChange={setSelectedExtras} 
            />

            <div className="border-t pt-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Prix de la chambre:</span>
                  <span>{roomPrice} € x {calculateNights()} nuit(s) = {roomPrice * calculateNights()} €</span>
                </div>
                
                {selectedExtras.filter(e => e.quantity > 0).map(extra => (
                  <div key={extra.id} className="flex items-center justify-between">
                    <span>{extra.name} (x{extra.quantity}):</span>
                    <span>{extra.price * extra.quantity} €</span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex items-center justify-between font-bold">
                  <span>Total:</span>
                  <span>{calculateTotalPrice()} €</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Le paiement sera à effectuer à la caisse après confirmation.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "En cours..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
