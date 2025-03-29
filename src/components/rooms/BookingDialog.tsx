
import React, { useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

type BookingDialogProps = {
  roomNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (guestName: string, clientId?: string) => Promise<void> | void;
};

const bookingFormSchema = z.object({
  guestName: z.string().min(1, "Le nom du client est requis"),
  clientId: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingDialog: React.FC<BookingDialogProps> = ({
  roomNumber,
  open,
  onOpenChange,
  onConfirm,
}) => {
  const { data: clients, isLoading: clientsLoading } = useClients();
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guestName: "",
      clientId: undefined,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        guestName: "",
        clientId: undefined,
      });
    }
  }, [open, form]);

  // Update guest name when client is selected
  const watchClientId = form.watch("clientId");
  useEffect(() => {
    if (watchClientId) {
      const selectedClient = clients?.find(client => client.id === watchClientId);
      if (selectedClient) {
        form.setValue("guestName", selectedClient.name);
      }
    }
  }, [watchClientId, clients, form]);

  const handleSubmit = async (data: BookingFormValues) => {
    await onConfirm(data.guestName, data.clientId);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Réserver la chambre {roomNumber}</DialogTitle>
          <DialogDescription>
            Sélectionnez un client existant ou entrez un nouveau nom pour cette réservation.
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
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
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
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du client</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      autoFocus 
                      placeholder="Nom du client" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Confirmer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
