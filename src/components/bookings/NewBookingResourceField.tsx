import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingType } from "@/types/bookings";
interface NewBookingResourceFieldProps {
  form: UseFormReturn<any>;
  resourceOptions: {
    value: string;
    label: string;
  }[];
  bookingType: BookingType;
}
export const NewBookingResourceField: React.FC<NewBookingResourceFieldProps> = ({
  form,
  resourceOptions,
  bookingType
}) => {
  const getResourceLabel = () => {
    switch (bookingType) {
      case 'room':
        return 'Chambre';
      case 'meeting':
        return 'Salle de réunion';
      case 'car':
        return 'Véhicule';
      case 'terrace':
        return 'Terrasse';
      case 'restaurant':
        return 'Espace restaurant';
      default:
        return 'Ressource';
    }
  };
  return <FormField control={form.control} name="resourceId" render={({
    field
  }) => {}} />;
};