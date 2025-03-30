
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getRoleName, getShiftName } from "@/utils/staffUtils";

const staffFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit comporter au moins 2 caractères",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide",
  }),
  contactNumber: z.string().min(6, {
    message: "Le numéro de téléphone doit comporter au moins 6 caractères",
  }),
  role: z.string({
    required_error: "Veuillez sélectionner un rôle",
  }),
  shift: z.string({
    required_error: "Veuillez sélectionner un service",
  }),
  isAvailable: z.boolean().default(true),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
  defaultValues?: StaffMember;
  onSubmit: (values: StaffFormValues) => void;
  isSubmitting: boolean;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          email: defaultValues.email,
          contactNumber: defaultValues.contactNumber,
          role: defaultValues.role,
          shift: defaultValues.shift,
          isAvailable: defaultValues.isAvailable,
        }
      : {
          name: "",
          email: "",
          contactNumber: "",
          role: "receptionist",
          shift: "morning",
          isAvailable: true,
        },
  });

  const handleSubmit = (values: StaffFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input placeholder="Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="jean.dupont@hotel.fr" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rôle</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manager">Directeur</SelectItem>
                    <SelectItem value="receptionist">Réceptionniste</SelectItem>
                    <SelectItem value="housekeeper">Femme de chambre</SelectItem>
                    <SelectItem value="waiter">Serveur</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                    <SelectItem value="bartender">Barman</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shift"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="morning">Matin</SelectItem>
                    <SelectItem value="afternoon">Après-midi</SelectItem>
                    <SelectItem value="night">Nuit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Disponibilité</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value ? "Disponible" : "Indisponible"}
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

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {defaultValues ? "Mettre à jour" : "Ajouter"} l'employé
          </Button>
        </div>
      </form>
    </Form>
  );
};
