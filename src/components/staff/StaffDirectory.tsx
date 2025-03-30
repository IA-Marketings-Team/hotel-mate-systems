
import React from "react";
import { StaffMember } from "@/hooks/useStaff";
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
import { Search, Phone, Mail, Check, X } from "lucide-react";

interface StaffDirectoryProps {
  staffMembers: StaffMember[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  shiftFilter: string;
  setShiftFilter: (value: string) => void;
  getRoleName: (role: string) => string;
  getShiftName: (shift: string) => string;
  getRoleColor: (role: string) => string;
}

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({
  staffMembers,
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  shiftFilter,
  setShiftFilter,
  getRoleName,
  getShiftName,
  getRoleColor,
}) => {
  return (
    <div className="space-y-6">
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

      {staffMembers.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-muted-foreground">Aucun employé trouvé avec ces critères</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {staffMembers.map((staff) => (
            <div key={staff.id} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-all">
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
      )}
    </div>
  );
};
