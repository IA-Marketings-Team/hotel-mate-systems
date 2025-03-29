
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

interface TransactionFormProps {
  registerType: RegisterType;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ registerType, onSuccess, onCancel }: TransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"payment" | "refund">("payment");
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories(registerType);
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useSubcategories(selectedCategory);

  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const selectedCategoryObj = categories?.find(cat => cat.id === selectedCategory);
      
      const { error } = await supabase.from("transactions").insert({
        description,
        amount: parseFloat(amount),
        type,
        method,
        register_type: registerType,
        category: selectedCategoryObj?.name || null,
        subcategory: subcategories?.find(subcat => subcat.id === selectedSubcategory)?.name || null,
        date: new Date().toISOString()
      });

      if (error) throw error;

      toast.success("La transaction a été ajoutée avec succès");
      
      onSuccess();
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Impossible de créer la transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <TransactionTypeSelector type={type} onTypeChange={setType} />
        <TransactionMethodSelector method={method} onMethodChange={setMethod} />
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
        <Button type="submit">Créer</Button>
      </DialogFooter>
    </form>
  );
}
