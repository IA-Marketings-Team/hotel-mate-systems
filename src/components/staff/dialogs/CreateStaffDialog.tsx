
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useStaffCrud } from "@/hooks/useStaffCrud";
import { BaseStaffDialog } from "./BaseStaffDialog";

export const CreateStaffDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const { createStaff } = useStaffCrud();

  const handleSubmit = async (values: any) => {
    await createStaff.mutateAsync(values);
  };

  return (
    <BaseStaffDialog
      open={open}
      onOpenChange={setOpen}
      title="Nouvel employé"
      description="Remplissez le formulaire ci-dessous pour ajouter un nouvel employé."
      onSubmit={handleSubmit}
      isSubmitting={createStaff.isPending}
      trigger={
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un employé
        </Button>
      }
    />
  );
};
