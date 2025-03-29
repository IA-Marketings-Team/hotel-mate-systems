
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4 py-8 text-center">
        <h1 className="text-7xl font-bold text-hotel-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-hotel-dark mb-4">Page non trouvée</h2>
        <p className="text-muted-foreground mb-6">
          La page <span className="font-medium">{location.pathname}</span> n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <a href="/" className="flex items-center gap-2">
            <Home className="size-4" />
            Retour à l'accueil
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
