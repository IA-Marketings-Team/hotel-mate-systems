
import React from "react";
import { useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RegisterType } from "@/types";
import { NewTransactionPageHeader } from "@/components/transactions/NewTransactionPageHeader";
import { NewTransactionPageForm } from "@/components/transactions/NewTransactionPageForm";

const NewTransaction = () => {
  const location = useLocation();
  const state = location.state as { 
    registerType?: RegisterType,
    clientId?: string,
    initialDescription?: string,
    initialType?: "payment" | "refund" | "pending" | "partial"
  } | null;
  
  // Default values
  const initialRegisterType = state?.registerType || "hotel";
  const initialClientId = state?.clientId || "none";
  const initialDescription = state?.initialDescription || "";
  const initialType = state?.initialType || "payment";

  return (
    <AppLayout>
      <div className="space-y-6">
        <NewTransactionPageHeader />

        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h1 className="text-2xl font-bold mb-6">Nouvelle transaction</h1>
          
          <NewTransactionPageForm 
            initialRegisterType={initialRegisterType}
            initialClientId={initialClientId}
            initialDescription={initialDescription}
            initialType={initialType}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewTransaction;
