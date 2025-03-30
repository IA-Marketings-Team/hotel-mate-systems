
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useStaffCrud } from "@/hooks/useStaffCrud";
import { StaffMember } from "@/hooks/useStaff";
import { BaseStaffDialog } from "./BaseStaffDialog";

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
  };

  return (
    <BaseStaffDialog
      open={open}
      onOpenChange={setOpen}
      title="Modifier un employé"
      description="Mettez à jour les informations de l'employé."
      onSubmit={handleSubmit}
      isSubmitting={updateStaff.isPending}
      defaultValues={staff}
      trigger={
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      }
    />
  );
};
