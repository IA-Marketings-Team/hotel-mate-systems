
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTeamName: string;
  setNewTeamName: (value: string) => void;
  newTeamDept: string;
  setNewTeamDept: (value: string) => void;
  onCreateTeam: () => void;
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({
  open,
  onOpenChange,
  newTeamName,
  setNewTeamName,
  newTeamDept,
  setNewTeamDept,
  onCreateTeam,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle équipe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle équipe</DialogTitle>
          <DialogDescription>
            Définissez le nom et le département de votre nouvelle équipe
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name">Nom de l'équipe</Label>
            <Input
              id="team-name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Ex: Service petit-déjeuner"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="department">Département</Label>
            <Input
              id="department"
              value={newTeamDept}
              onChange={(e) => setNewTeamDept(e.target.value)}
              placeholder="Ex: Restauration"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onCreateTeam}>Créer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
