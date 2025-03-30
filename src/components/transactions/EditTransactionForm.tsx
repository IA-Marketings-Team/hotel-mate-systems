
import React, { useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Transaction } from "@/types";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionMethodSelector } from "./TransactionMethodSelector";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { DescriptionField } from "./form-fields/DescriptionField";
import { AmountField } from "./form-fields/AmountField";
import { useTransactionForm } from "@/hooks/useTransactionForm";

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
  const {
    type, setType,
    method, setMethod,
    description, setDescription,
    amount, setAmount,
    selectedCategory, setSelectedCategory,
    selectedSubcategory, setSelectedSubcategory,
    getFormData
  } = useTransactionForm({
    initialType: transaction.type,
    initialDescription: transaction.description,
    initialAmount: transaction.amount,
    initialCategory: transaction.category || null,
    initialSubcategory: transaction.subcategory || null
  });

  // Reset the form when the transaction changes
  useEffect(() => {
    setType(transaction.type);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setMethod(transaction.method);
  }, [transaction, setType, setDescription, setAmount, setMethod]);

  // Handle category changes when data loads
  useEffect(() => {
    if (transaction.category) {
      // This will be handled by the CategorySelector component
      // which will find the category ID based on the name
      setSelectedCategory(null);
    }
  }, [transaction.category, setSelectedCategory]);

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory(null);
  }, [selectedCategory, setSelectedSubcategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await onSave({
        description,
        amount: parseFloat(amount),
        type,
        method,
        category: selectedCategory,
        subcategory: selectedSubcategory
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
            selectedCategory={selectedCategory} 
            onCategoryChange={setSelectedCategory}
            registerType={transaction.registerType}
          />

          {selectedCategory && (
            <SubcategorySelector 
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={setSelectedSubcategory}
            />
          )}

          <AmountField
            amount={amount}
            setAmount={setAmount}
          />

          <DescriptionField
            description={description}
            setDescription={setDescription}
          />

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
