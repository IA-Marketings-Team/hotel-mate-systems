
import React from "react";
import { useForm } from "react-hook-form";
import { Room, RoomStatus } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

type RoomDialogProps = {
  room?: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: RoomFormValues) => Promise<void> | void;
};

const roomFormSchema = z.object({
  number: z.string().min(1, "Le numéro de chambre est requis"),
  type: z.enum(["standard", "deluxe", "suite", "presidential"]),
  capacity: z.coerce.number().min(1, "La capacité doit être d'au moins 1"),
  pricePerNight: z.coerce.number().min(0, "Le prix doit être positif"),
  floor: z.coerce.number().min(0, "L'étage doit être positif"),
  view: z.enum(["garden", "pool", "sea", "mountain", "city"]),
  status: z.enum(["available", "occupied", "cleaning", "cleaning_pending", "maintenance"]),
  maintenanceStatus: z.boolean().default(false),
  cleaningStatus: z.boolean().default(false),
  notes: z.string().optional(),
  currentGuest: z.string().optional(),
  features: z.array(z.string()).default([]),
});

export type RoomFormValues = z.infer<typeof roomFormSchema>;

const availableFeatures = [
  "wifi",
  "tv",
  "air conditioning",
  "mini-bar",
  "balcony",
  "jacuzzi",
  "kitchen",
  "workspace",
  "safe",
  "non-smoking",
];

const RoomDialog: React.FC<RoomDialogProps> = ({
  room,
  open,
  onOpenChange,
  onSave,
}) => {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: room
      ? {
          ...room,
          features: room.features || [],
          notes: room.notes || "",
          maintenanceStatus: room.maintenanceStatus || false,
          cleaningStatus: room.cleaningStatus || false,
        }
      : {
          number: "",
          type: "standard",
          capacity: 2,
          pricePerNight: 100,
          floor: 1,
          view: "garden",
          status: "available",
          maintenanceStatus: false,
          cleaningStatus: false,
          features: [],
          notes: "",
        },
  });

  const handleSubmit = async (data: RoomFormValues) => {
    await onSave(data);
    onOpenChange(false);
  };

  const getViewLabel = (view: string) => {
    switch (view) {
      case "garden": return "Jardin";
      case "pool": return "Piscine";
      case "sea": return "Mer";
      case "mountain": return "Montagne";
      case "city": return "Ville";
      default: return view;
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    switch (status) {
      case "available": return "Disponible";
      case "occupied": return "Occupée";
      case "cleaning": return "Nettoyage";
      case "cleaning_pending": return "En attente de nettoyage";
      case "maintenance": return "Maintenance";
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "standard": return "Standard";
      case "deluxe": return "Deluxe";
      case "suite": return "Suite";
      case "presidential": return "Présidentielle";
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{room ? `Modifier la chambre ${room.number}` : "Ajouter une chambre"}</DialogTitle>
          <DialogDescription>
            {room
              ? "Mettez à jour les informations de cette chambre."
              : "Ajoutez une nouvelle chambre à l'hôtel."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Étage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="presidential">Présidentielle</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="view"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vue</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une vue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="garden">Jardin</SelectItem>
                        <SelectItem value="pool">Piscine</SelectItem>
                        <SelectItem value="sea">Mer</SelectItem>
                        <SelectItem value="mountain">Montagne</SelectItem>
                        <SelectItem value="city">Ville</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerNight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix par nuit (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="occupied">Occupée</SelectItem>
                        <SelectItem value="cleaning">Nettoyage</SelectItem>
                        <SelectItem value="cleaning_pending">En attente de nettoyage</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentGuest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client actuel</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="maintenanceStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between border p-4 rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>En maintenance</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        La chambre est en cours de maintenance
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cleaningStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between border p-4 rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>À nettoyer</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        La chambre nécessite un nettoyage
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Équipements</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFeatures.map((feature) => (
                      <FormField
                        key={feature}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={feature}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature)}
                                  onCheckedChange={(checked: CheckedState) => {
                                    if (checked) {
                                      field.onChange([...field.value, feature]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== feature
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {feature}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ajoutez des notes sur cette chambre..."
                      {...field}
                      value={field.value || ""}
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
                {room ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;
