
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffRoleFieldsProps {
  control: any;
}

export const StaffRoleFields: React.FC<StaffRoleFieldsProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
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
  );
};
