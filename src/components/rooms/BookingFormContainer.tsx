
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RoomExtra } from "./RoomExtrasSelector";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { ClientFormField } from "./ClientFormField";
import { DateRangeFormField } from "./DateRangeFormField";
import { RoomExtrasSelector } from "./RoomExtrasSelector";
import { BookingDetails } from "./BookingDetails";
import { useInvoices } from "@/hooks/useInvoices";

interface BookingFormContainerProps {
  form: UseFormReturn<any>;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  clientsLoading: boolean;
  clients?: any[];
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  selectedExtras: RoomExtra[];
  setSelectedExtras: (extras: RoomExtra[]) => void;
  roomNumber: string;
  roomPrice: number;
  onConfirm: (guestName: string, clientId?: string, extras?: RoomExtra[], dateRange?: DateRange) => Promise<void> | void;
}

export const BookingFormContainer: React.FC<BookingFormContainerProps> = ({
  form,
  dateRange,
  setDateRange,
  clientsLoading,
  clients,
  onOpenChange,
  isSubmitting,
  setIsSubmitting,
  selectedExtras,
  setSelectedExtras,
  roomNumber,
  roomPrice,
  onConfirm
}) => {
  const navigate = useNavigate();
  const { createInvoice } = useInvoices();

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

  const handleSubmit = async (data: any) => {
    const selectedClient = clients?.find(client => client.id === data.clientId);
    if (selectedClient) {
      setIsSubmitting(true);
      try {
        await onConfirm(selectedClient.name, selectedClient.id, selectedExtras, dateRange);
        form.reset();
        
        // Build extras description for invoice
        const extrasDescription = selectedExtras
          .filter(extra => extra.quantity > 0)
          .map(extra => `${extra.quantity}x ${extra.name}`)
          .join(", ");
        
        const description = `Réservation Chambre ${roomNumber} pour ${calculateNights()} nuit(s)${extrasDescription ? ` (${extrasDescription})` : ""}`;
        const totalAmount = calculateTotalPrice();
        
        console.log("Creating invoice with data:", {
          description,
          amount: totalAmount,
          clientId: selectedClient.id,
          staffId: null,
          category: "Chambres",
          subcategory: "Réservations",
          registerType: "hotel",
          method: "card" // Adding explicit method
        });
        
        // Create invoice with correct data structure
        await createInvoice.mutateAsync({
          description,
          amount: totalAmount,
          clientId: selectedClient.id,
          staffId: null,
          category: "Chambres",
          subcategory: "Réservations",
          registerType: "hotel",
          method: "card" // Adding explicit method
        });
        
        toast.success(`Chambre ${roomNumber} réservée pour ${selectedClient.name}`, {
          description: "Une facture a été créée. Vous pouvez effectuer le paiement ultérieurement."
        });
        
        // Navigate to invoices page
        setTimeout(() => {
          navigate("/invoices");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <ClientFormField form={form} clientsLoading={clientsLoading} clients={clients} />
        <DateRangeFormField form={form} dateRange={dateRange} setDateRange={setDateRange} />

        <Separator />
        
        <RoomExtrasSelector 
          extras={selectedExtras} 
          onChange={setSelectedExtras} 
        />

        <BookingDetails 
          roomPrice={roomPrice} 
          calculateNights={calculateNights} 
          selectedExtras={selectedExtras}
          calculateTotalPrice={calculateTotalPrice} 
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
            {isSubmitting ? "En cours..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
