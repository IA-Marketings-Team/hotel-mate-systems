import React from "react";
import { StaffMember } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Calendar, FileText, UserCog } from "lucide-react";
import { StaffScheduleTab } from "./StaffScheduleTab";

interface StaffProfileDialogProps {
  staff: StaffMember;
  getRoleName: (role: string) => string;
  getShiftName: (shift: string) => string;
}

export const StaffProfileDialog: React.FC<StaffProfileDialogProps> = ({
  staff,
  getRoleName,
  getShiftName,
}) => {
  return (
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
            <StaffScheduleTab staffId={staff.id} />
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
  );
};
