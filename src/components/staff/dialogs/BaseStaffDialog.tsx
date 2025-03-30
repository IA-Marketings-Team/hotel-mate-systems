
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StaffForm } from "../forms/StaffForm";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";

interface BaseStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: StaffMember;
  trigger: React.ReactNode;
}

export const BaseStaffDialog: React.FC<BaseStaffDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  isSubmitting,
  defaultValues,
  trigger,
}) => {
  const handleSubmit = async (values: any) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <StaffForm 
          defaultValues={defaultValues} 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};
