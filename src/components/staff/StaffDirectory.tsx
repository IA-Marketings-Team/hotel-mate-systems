
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
import { Search, Phone, Mail, Check, X, Calendar, FileText, UserCog } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Voir profil
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Profil de {staff.name}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="overview">
                      <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="schedule">
                          <Calendar className="h-4 w-4 mr-2" />
                          Planning
                        </TabsTrigger>
                        <TabsTrigger value="documents">
                          <FileText className="h-4 w-4 mr-2" />
                          Documents
                        </TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="settings">
                          <UserCog className="h-4 w-4 mr-2" />
                          Paramètres
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold">Informations personnelles</p>
                              <div className="mt-2 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Nom:</span>
                                  <span>{staff.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span>{staff.email}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Téléphone:</span>
                                  <span>{staff.contactNumber}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Informations professionnelles</p>
                              <div className="mt-2 space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Rôle:</span>
                                  <span>{getRoleName(staff.role)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Service:</span>
                                  <span>{getShiftName(staff.shift)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Statut:</span>
                                  <span>{staff.isAvailable ? "Disponible" : "Indisponible"}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Compétences et certifications</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline">Formation sécurité</Badge>
                              <Badge variant="outline">Premiers secours</Badge>
                              <Badge variant="outline">Anglais courant</Badge>
                              <Badge variant="outline">Service client</Badge>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Notes</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Employé exemplaire, toujours ponctuel et efficace.
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="schedule">
                        <div className="p-4 bg-muted rounded-lg text-center">
                          Calendrier et planning des shifts à venir
                        </div>
                      </TabsContent>
                      <TabsContent value="documents">
                        <div className="p-4 bg-muted rounded-lg text-center">
                          Documents administratifs et contrats
                        </div>
                      </TabsContent>
                      <TabsContent value="performance">
                        <div className="p-4 bg-muted rounded-lg text-center">
                          Évaluations et indicateurs de performance
                        </div>
                      </TabsContent>
                      <TabsContent value="settings">
                        <div className="p-4 bg-muted rounded-lg text-center">
                          Paramètres et préférences de l'employé
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
                <Button variant="default" size="sm">
                  Contacter
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
