
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RegisterType } from "@/types";
import { useInvoices } from "@/hooks/useInvoices";
import { toast } from "sonner";
import { InvoiceForm } from "@/components/invoices/InvoiceForm";
import { validateInvoiceForm } from "@/components/invoices/InvoiceFormValidation";

const NewInvoice = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { 
    registerType?: RegisterType,
    clientId?: string,
    initialDescription?: string
  } | null;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createInvoice } = useInvoices();

  const handleSubmit = async (formData: any) => {
    const validation = validateInvoiceForm({
      description: formData.description,
      amount: formData.amount
    });
    
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createInvoice.mutateAsync({
        description: formData.description,
        amount: formData.amount,
        clientId: formData.clientId,
        staffId: formData.staffId,
        category: formData.category,
        subcategory: formData.subcategory,
        registerType: formData.registerType,
        dueDate: formData.dueDate,
      });

      toast.success("Facture créée avec succès");
      navigate("/invoices", { 
        state: { 
          highlightInvoiceId: result.id
        } 
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Erreur lors de la création de la facture");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/invoices");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux factures
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border">
          <h1 className="text-2xl font-bold mb-6">Nouvelle facture</h1>
          
          <InvoiceForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            initialData={{
              registerType: state?.registerType,
              clientId: state?.clientId,
              description: state?.initialDescription
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewInvoice;
