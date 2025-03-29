
import React from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";

interface TransactionErrorProps {
  message: string;
  onGoBack: () => void;
}

export const TransactionError: React.FC<TransactionErrorProps> = ({
  message,
  onGoBack
}) => {
  return (
    <AppLayout>
      <div className="p-8 text-center">
        <p className="text-xl text-muted-foreground mb-4">{message}</p>
        <Button onClick={onGoBack}>Retour aux caisses</Button>
      </div>
    </AppLayout>
  );
};
