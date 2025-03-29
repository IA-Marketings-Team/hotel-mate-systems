
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockStaff } from "@/lib/mock-data";
import { StaffMember, StaffRole } from "@/types";
import { Search, Phone, Mail, Check, X } from "lucide-react";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");

  const getRoleName = (role: StaffRole) => {
    switch (role) {
      case "manager":
        return "Directeur";
      case "receptionist":
        return "Réceptionniste";
      case "housekeeper":
        return "Femme de chambre";
      case "waiter":
        return "Serveur";
      case "chef":
        return "Chef";
      case "bartender":
        return "Barman";
      case "maintenance":
        return "Maintenance";
    }
  };

  const getShiftName = (shift: string) => {
    switch (shift) {
      case "morning":
        return "Matin";
      case "afternoon":
        return "Après-midi";
      case "night":
        return "Nuit";
      default:
        return shift;
    }
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case "manager":
        return "bg-purple-100 text-purple-800";
      case "receptionist":
        return "bg-blue-100 text-blue-800";
      case "housekeeper":
        return "bg-green-100 text-green-800";
      case "waiter":
        return "bg-yellow-100 text-yellow-800";
      case "chef":
        return "bg-red-100 text-red-800";
      case "bartender":
        return "bg-orange-100 text-orange-800";
      case "maintenance":
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredStaff = mockStaff.filter((staff) => {
    // Search term filter
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.contactNumber.includes(searchTerm);

    // Role filter
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;

    // Shift filter
    const matchesShift = shiftFilter === "all" || staff.shift === shiftFilter;

    return matchesSearch && matchesRole && matchesShift;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Personnel</h1>
        <Button>Ajouter un employé</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un employé..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="manager">Directeur</SelectItem>
            <SelectItem value="receptionist">Réceptionniste</SelectItem>
            <SelectItem value="housekeeper">Femme de chambre</SelectItem>
            <SelectItem value="waiter">Serveur</SelectItem>
            <SelectItem value="chef">Chef</SelectItem>
            <SelectItem value="bartender">Barman</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={shiftFilter}
          onValueChange={(value) => setShiftFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les services</SelectItem>
            <SelectItem value="morning">Matin</SelectItem>
            <SelectItem value="afternoon">Après-midi</SelectItem>
            <SelectItem value="night">Nuit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="hotel-card hover:shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{staff.name}</h3>
              <Badge className={getRoleColor(staff.role)}>
                {getRoleName(staff.role)}
              </Badge>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <span className="text-sm">{staff.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <span className="text-sm">{staff.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Service:</span>
                <span className="text-sm font-medium">{getShiftName(staff.shift)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Disponible:</span>
                {staff.isAvailable ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <Check className="size-4" />
                    <span className="text-sm font-medium">Oui</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <X className="size-4" />
                    <span className="text-sm font-medium">Non</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">
                Voir planning
              </Button>
              <Button variant="default" size="sm">
                Détails
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;
