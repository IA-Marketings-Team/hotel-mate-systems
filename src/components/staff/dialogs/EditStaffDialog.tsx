
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
import { Pencil } from "lucide-react";
import { StaffForm } from "../forms/StaffForm";
import { useStaffCrud } from "@/hooks/useStaffCrud";
import { StaffMember } from "@/hooks/useStaff";

interface EditStaffDialogProps {
  staff: StaffMember;
}

export const EditStaffDialog: React.FC<EditStaffDialogProps> = ({ staff }) => {
  const [open, setOpen] = React.useState(false);
  const { updateStaff } = useStaffCrud();

  const handleSubmit = async (values: any) => {
    await updateStaff.mutateAsync({
      id: staff.id,
      ...values
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier un employé</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de l'employé.
          </DialogDescription>
        </DialogHeader>
        <StaffForm 
          defaultValues={staff} 
          onSubmit={handleSubmit} 
          isSubmitting={updateStaff.isPending} 
        />
      </DialogContent>
    </Dialog>
  );
};
