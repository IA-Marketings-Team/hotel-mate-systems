
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCategory } from "@/hooks/useCategories";

interface CategorySelectorProps {
  categories: ServiceCategory[] | undefined;
  selectedCategory: string | null;
  onCategoryChange: (value: string) => void;
  isLoading: boolean;
}

export function CategorySelector({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  isLoading 
}: CategorySelectorProps) {
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
