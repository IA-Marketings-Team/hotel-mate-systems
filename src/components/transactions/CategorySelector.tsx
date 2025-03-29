
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegisterType } from "@/types";
import { useCategories } from "@/hooks/useCategories";

interface CategorySelectorProps {
  selectedCategory: string | null;
  onCategoryChange: (value: string) => void;
  registerType: RegisterType;
}

export function CategorySelector({ 
  selectedCategory, 
  onCategoryChange, 
  registerType 
}: CategorySelectorProps) {
  const { data: categories, isLoading } = useCategories(registerType);

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Catégorie</Label>
      <Select
        value={selectedCategory || ""}
        onValueChange={onCategoryChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {categories?.filter(cat => !cat.parent_id).map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
