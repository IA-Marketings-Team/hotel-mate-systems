
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NewTransactionPageHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={() => navigate("/registers")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux caisses
      </Button>
    </div>
  );
};
