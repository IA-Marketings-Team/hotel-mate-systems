
import React from "react";
import { CreateStaffDialog } from "./dialogs/CreateStaffDialog";

interface StaffHeaderProps {
  title: string;
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      <CreateStaffDialog />
    </div>
  );
};
