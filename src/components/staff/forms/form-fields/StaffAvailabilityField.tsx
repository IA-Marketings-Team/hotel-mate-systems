
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface StaffAvailabilityFieldProps {
  control: any;
}

export const StaffAvailabilityField: React.FC<StaffAvailabilityFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
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
  );
};
