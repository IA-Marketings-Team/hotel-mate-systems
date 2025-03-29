
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Transaction } from "@/types";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionMethodSelector } from "./TransactionMethodSelector";
import { useCategories, useSubcategories } from "@/hooks/useCategories";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";

interface EditTransactionFormProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTransaction: Partial<Transaction>) => Promise<void>;
  isSaving: boolean;
}

export function EditTransactionForm({ 
  transaction, 
  isOpen, 
  onClose, 
  onSave,
  isSaving
}: EditTransactionFormProps) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [type, setType] = useState<"payment" | "refund" | "pending">(transaction.type);
  const [method, setMethod] = useState<"cash" | "card" | "transfer">(transaction.method);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const { data: categories, isLoading: isCategoriesLoading } = useCategories(transaction.registerType);
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useSubcategories(selectedCategory);

  useEffect(() => {
    if (categories && transaction.category) {
      const category = categories.find(c => c.name === transaction.category);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [categories, transaction.category]);

  useEffect(() => {
    if (subcategories && transaction.subcategory) {
      const subcategory = subcategories.find(s => s.name === transaction.subcategory);
      if (subcategory) {
        setSelectedSubcategory(subcategory.id);
      }
    }
  }, [subcategories, transaction.subcategory]);

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
      const selectedSubcategoryObj = subcategories?.find(subcat => subcat.id === selectedSubcategory);
      
      await onSave({
        description,
        amount: parseFloat(amount),
        type,
        method,
        category: selectedCategoryObj?.name || null,
        subcategory: selectedSubcategoryObj?.name || null
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Impossible de mettre à jour la transaction");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la transaction</DialogTitle>
        </DialogHeader>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
