
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RegisterSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function RegisterSearch({ searchTerm, onSearchChange }: RegisterSearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Rechercher des transactions..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
