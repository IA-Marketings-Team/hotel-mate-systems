
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceCategory } from "@/hooks/useCategories";

interface SubcategorySelectorProps {
  subcategories: ServiceCategory[] | undefined;
  selectedSubcategory: string | null;
  onSubcategoryChange: (value: string) => void;
  isLoading: boolean;
}

export function SubcategorySelector({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  isLoading
}: SubcategorySelectorProps) {
  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="subcategory">Sous-catégorie</Label>
      <Select
        value={selectedSubcategory || ""}
        onValueChange={onSubcategoryChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner une sous-catégorie" />
        </SelectTrigger>
        <SelectContent>
          {subcategories.map((subcategory) => (
            <SelectItem key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
