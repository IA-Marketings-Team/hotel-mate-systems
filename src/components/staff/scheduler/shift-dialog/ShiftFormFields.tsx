
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { StaffMember } from "@/hooks/useStaff";
import { CreateShiftInput, UpdateShiftInput } from "@/hooks/useShiftCrud";

interface ShiftFormFieldsProps {
  control: Control<CreateShiftInput | UpdateShiftInput>;
  staffMembers: StaffMember[];
  isSubmitting: boolean;
  onStaffChange?: (staffId: string) => void;
  disableStaffSelection?: boolean;
}

export const ShiftFormFields: React.FC<ShiftFormFieldsProps> = ({
  control,
  staffMembers,
  isSubmitting,
  onStaffChange,
  disableStaffSelection = false,
}) => {
  return (
    <>
      <FormField
        control={control}
        name="staffId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employé</FormLabel>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (onStaffChange) {
                  onStaffChange(value);
                }
              }}
              disabled={isSubmitting || disableStaffSelection}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure de début</FormLabel>
              <FormControl>
                <Input type="time" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heure de fin</FormLabel>
              <FormControl>
                <Input type="time" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de shift</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
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
    </>
  );
};
