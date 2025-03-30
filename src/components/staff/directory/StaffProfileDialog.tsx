
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
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Profil de {staff.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="space-y-2">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="overview" className="text-xs">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <UserCog className="h-3 w-3 mr-1" />
              Paramètres
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold">Informations personnelles</p>
                <div className="text-xs space-y-1">
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
              <div className="space-y-2">
                <p className="text-xs font-semibold">Informations professionnelles</p>
                <div className="text-xs space-y-1">
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
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold">Compétences et certifications</p>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline" className="text-[0.6rem]">Formation sécurité</Badge>
                <Badge variant="outline" className="text-[0.6rem]">Premiers secours</Badge>
                <Badge variant="outline" className="text-[0.6rem]">Anglais courant</Badge>
                <Badge variant="outline" className="text-[0.6rem]">Service client</Badge>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold">Notes</p>
              <p className="text-xs text-muted-foreground">
                Employé exemplaire, toujours ponctuel et efficace.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="schedule">
            <StaffScheduleTab staffId={staff.id} />
          </TabsContent>
          <TabsContent value="documents">
            <div className="p-2 bg-muted rounded-lg text-center text-xs">
              Documents administratifs et contrats
            </div>
          </TabsContent>
          <TabsContent value="performance">
            <div className="p-2 bg-muted rounded-lg text-center text-xs">
              Évaluations et indicateurs de performance
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="p-2 bg-muted rounded-lg text-center text-xs">
              Paramètres et préférences de l'employé
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

