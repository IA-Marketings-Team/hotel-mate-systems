
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const RoomDetailsLoading: React.FC = () => {
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
        <Skeleton className="h-8 w-60" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  );
};

export default RoomDetailsLoading;
