
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface StaffSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  shiftFilter: string;
  setShiftFilter: (value: string) => void;
}

export const StaffSearchFilter: React.FC<StaffSearchFilterProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  shiftFilter,
  setShiftFilter,
}) => {
  return (
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
  );
};
