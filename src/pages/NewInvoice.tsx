
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionTypeSelector } from "@/components/transactions/TransactionTypeSelector";
import { TransactionMethodSelector } from "@/components/transactions/TransactionMethodSelector";
import { CategorySelector } from "@/components/transactions/CategorySelector";
import { SubcategorySelector } from "@/components/transactions/SubcategorySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";
import { useClients } from "@/hooks/useClients";
import { Label } from "@/components/ui/label";
import { RegisterType } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";
import { toast } from "sonner";

const NewInvoice = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTransaction } = useTransactions();
  
  // Form state
  const [type] = useState<"payment" | "refund" | "pending">("pending");
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("card");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [clientId, setClientId] = useState("none");
  const [staffId, setStaffId] = useState("none");
  const [registerType, setRegisterType] = useState<RegisterType>("hotel");

  const { data: staff, isLoading: isStaffLoading } = useStaff();
  const { data: clients, isLoading: isClientsLoading } = useClients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createTransaction.mutateAsync({
        description,
        amount: parseFloat(amount),
        type,
        method,
        registerType,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        clientId: clientId === "none" ? null : clientId,
        staffId: staffId === "none" ? null : staffId,
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="register-type">Caisse</Label>
              <Select value={registerType} onValueChange={(value) => setRegisterType(value as RegisterType)}>
                <SelectTrigger id="register-type">
                  <SelectValue placeholder="Sélectionner une caisse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hôtel</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="poker">Poker</SelectItem>
                  <SelectItem value="rooftop">Rooftop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description de la facture"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <TransactionMethodSelector method={method} onMethodChange={setMethod} />

            <CategorySelector 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              registerType={registerType}
            />

            {selectedCategory && (
              <SubcategorySelector 
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onSubcategoryChange={setSelectedSubcategory}
              />
            )}

            <div>
              <Label htmlFor="clientId">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Sélectionner un client (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun client</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="staffId">Personnel</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger id="staffId">
                  <SelectValue placeholder="Sélectionner un membre du personnel (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun personnel</SelectItem>
                  {staff?.map((staffMember) => (
                    <SelectItem key={staffMember.id} value={staffMember.id}>
                      {staffMember.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/invoices")}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "En cours..." : "Créer la facture"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewInvoice;
