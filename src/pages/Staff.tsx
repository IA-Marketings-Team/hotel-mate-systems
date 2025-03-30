
import React, { useState } from "react";
import { useStaff } from "@/hooks/useStaff";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { StaffTabs } from "@/components/staff/StaffTabs";
import { StaffActionButtons } from "@/components/staff/StaffActionButtons";
import { StaffLoading } from "@/components/staff/StaffLoading";
import { StaffError } from "@/components/staff/StaffError";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const { data: staffMembers, isLoading, error } = useStaff();
  
  if (isLoading) {
    return <StaffLoading />;
  }

  if (error) {
    return <StaffError message={error.message} />;
  }

  const filteredStaff = staffMembers?.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.contactNumber.includes(searchTerm);

    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesShift = shiftFilter === "all" || staff.shift === shiftFilter;

    return matchesSearch && matchesRole && matchesShift;
  }) || [];

  return (
    <div className="space-y-6">
      <StaffHeader title="Gestion du Personnel" />
      <StaffActionButtons />
      <StaffTabs
        staffMembers={staffMembers || []}
        filteredStaff={filteredStaff}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
      />
    </div>
  );
};

export default Staff;
