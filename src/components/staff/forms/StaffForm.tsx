
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { StaffBasicInfoFields } from "./form-fields/StaffBasicInfoFields";
import { StaffRoleFields } from "./form-fields/StaffRoleFields";
import { StaffAvailabilityField } from "./form-fields/StaffAvailabilityField";

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
        <StaffBasicInfoFields control={form.control} />
        <StaffRoleFields control={form.control} />
        <StaffAvailabilityField control={form.control} />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {defaultValues ? "Mettre à jour" : "Ajouter"} l'employé
          </Button>
        </div>
      </form>
    </Form>
  );
};
