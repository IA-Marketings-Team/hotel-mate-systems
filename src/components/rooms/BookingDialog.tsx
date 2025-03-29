
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

type BookingDialogProps = {
  roomNumber: string;
  roomPrice: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (guestName: string, clientId?: string) => Promise<void> | void;
};

const bookingFormSchema = z.object({
  clientId: z.string().min(1, "La sélection d'un client est requise"),
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
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      clientId: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        clientId: "",
      });
    }
  }, [open, form]);

  const handleSubmit = async (data: BookingFormValues) => {
    const selectedClient = clients?.find(client => client.id === data.clientId);
    if (selectedClient) {
      setIsSubmitting(true);
      try {
        await onConfirm(selectedClient.name, selectedClient.id);
        form.reset();
        
        toast.success(`Chambre ${roomNumber} réservée pour ${selectedClient.name}`, {
          description: "Veuillez procéder au paiement à la caisse."
        });
        
        // Navigate to register page for payment
        setTimeout(() => {
          navigate("/registers", { 
            state: { 
              pendingPayment: {
                clientId: selectedClient.id,
                clientName: selectedClient.name,
                description: `Réservation Chambre ${roomNumber}`,
                amount: roomPrice
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Réserver la chambre {roomNumber}</DialogTitle>
          <DialogDescription>
            Sélectionnez un client pour cette réservation. Un paiement sera demandé à la caisse.
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

            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Prix de la chambre:</span>
                <span className="font-bold">{roomPrice} €</span>
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
