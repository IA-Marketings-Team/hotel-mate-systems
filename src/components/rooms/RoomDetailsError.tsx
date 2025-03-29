
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoomDetailsErrorProps {
  error: string | null;
}

const RoomDetailsError: React.FC<RoomDetailsErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/rooms")}
        >
          <ChevronLeft className="size-4 mr-1" /> Retour
        </Button>
        <h1 className="text-2xl font-bold">Chambre non trouvée</h1>
      </div>
      <div className="text-red-500">
        {error || "Cette chambre n'existe pas ou a été supprimée."}
      </div>
    </div>
  );
};

export default RoomDetailsError;
