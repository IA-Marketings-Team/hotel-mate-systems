
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StaffForm } from "../forms/StaffForm";
import { useStaffCrud } from "@/hooks/useStaffCrud";

export const CreateStaffDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { createStaff } = useStaffCrud();

  const handleSubmit = async (values: any) => {
    await createStaff.mutateAsync(values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvel employé</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour ajouter un nouvel employé.
          </DialogDescription>
        </DialogHeader>
        <StaffForm 
          onSubmit={handleSubmit} 
          isSubmitting={createStaff.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};
