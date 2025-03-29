import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCategories, useSubcategories } from "@/hooks/useCategories";
import { supabase } from "@/integrations/supabase/client";
import { RegisterType } from "@/types";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionMethodSelector } from "./TransactionMethodSelector";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { useClients } from "@/hooks/useClients";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TransactionFormProps {
  registerType: RegisterType;
  onSubmit?: (data: any) => Promise<void>;
  onSuccess?: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  clientId?: string;
  initialType?: "payment" | "refund";
  initialDescription?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialSubcategory?: string;
}

export function TransactionForm({ 
  registerType, 
  onSubmit,
  onSuccess, 
  onCancel,
  isSubmitting = false,
  clientId,
  initialType = "payment",
  initialDescription = "",
  initialAmount,
  initialCategory,
  initialSubcategory
}: TransactionFormProps) {
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : "");
  const [type, setType] = useState<"payment" | "refund">(initialType);
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(clientId);
  const [submitting, setSubmitting] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories(registerType);
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useSubcategories(selectedCategory);
  const { data: clients, isLoading: isClientsLoading } = useClients();

  useEffect(() => {
    if (categories && initialCategory) {
      const category = categories.find(cat => cat.name === initialCategory);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [categories, initialCategory]);

  useEffect(() => {
    if (subcategories && initialSubcategory && selectedCategory) {
      const subcategory = subcategories.find(subcat => subcat.name === initialSubcategory);
      if (subcategory) {
        setSelectedSubcategory(subcategory.id);
      }
    }
  }, [subcategories, initialSubcategory, selectedCategory]);

  useEffect(() => {
    if (selectedCategory !== null) {
      if (!initialSubcategory || selectedSubcategory !== null) {
        setSelectedSubcategory(null);
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (clientId) {
      setSelectedClientId(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    if (initialDescription) {
      setDescription(initialDescription);
    }
    if (initialAmount) {
      setAmount(initialAmount.toString());
    }
  }, [initialDescription, initialAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setSubmitting(true);
      
      if (onSubmit) {
        const selectedCategoryObj = categories?.find(cat => cat.id === selectedCategory);
        const selectedSubcategoryObj = subcategories?.find(subcat => subcat.id === selectedSubcategory);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        await onSubmit({
          description,
          amount,
          type,
          method,
          category: selectedCategoryObj?.name || null,
          subcategory: selectedSubcategoryObj?.name || null,
          clientId: selectedClientId === "no-client" ? null : selectedClientId || null,
          staffId: user?.id || null,
        });
      } 
      else if (onSuccess) {
        const selectedCategoryObj = categories?.find(cat => cat.id === selectedCategory);
        const selectedSubcategoryObj = subcategories?.find(subcat => subcat.id === selectedSubcategory);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase.from("transactions").insert({
          description,
          amount: parseFloat(amount),
          type,
          method,
          register_type: registerType,
          category: selectedCategoryObj?.name || null,
          subcategory: selectedSubcategoryObj?.name || null,
          client_id: selectedClientId === "no-client" ? null : selectedClientId || null,
          staff_id: user?.id || null,
          date: new Date().toISOString()
        });

        if (error) throw error;

        toast.success("La transaction a été ajoutée avec succès");
        
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Impossible de créer la transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TransactionTypeSelector type={type} onTypeChange={setType} />
        <TransactionMethodSelector method={method} onMethodChange={setMethod} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Select 
          value={selectedClientId} 
          onValueChange={setSelectedClientId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un client (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            {isClientsLoading ? (
              <SelectItem value="loading" disabled>Chargement des clients...</SelectItem>
            ) : clients && clients.length > 0 ? (
              <>
                <SelectItem value="no-client">Aucun client</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </>
            ) : (
              <SelectItem value="empty" disabled>Aucun client trouvé</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <CategorySelector 
        categories={categories} 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
        isLoading={isCategoriesLoading}
      />

      {selectedCategory && (
        <SubcategorySelector 
          subcategories={subcategories} 
          selectedSubcategory={selectedSubcategory}
          onSubcategoryChange={setSelectedSubcategory}
          isLoading={isSubcategoriesLoading}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Montant (€)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la transaction"
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} className="mr-2">Annuler</Button>
        <Button type="submit" disabled={isSubmitting || submitting}>Créer</Button>
      </DialogFooter>
    </form>
  );
}
