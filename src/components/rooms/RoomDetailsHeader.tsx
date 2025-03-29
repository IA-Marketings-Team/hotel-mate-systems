
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoomDetailsHeaderProps {
  roomNumber: string;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const RoomDetailsHeader: React.FC<RoomDetailsHeaderProps> = ({
  roomNumber,
  onEditClick,
  onDeleteClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/rooms")}
        >
          <ChevronLeft className="size-4 mr-1" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">Chambre {roomNumber}</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onEditClick}
          className="flex items-center gap-1"
        >
          <Pencil className="size-4" /> Modifier
        </Button>
        <Button 
          variant="destructive" 
          onClick={onDeleteClick}
          className="flex items-center gap-1"
        >
          <Trash2 className="size-4" /> Supprimer
        </Button>
      </div>
    </div>
  );
};

export default RoomDetailsHeader;
