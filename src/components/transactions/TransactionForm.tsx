
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionMethodSelector } from "./TransactionMethodSelector";
import { CategorySelector } from "./CategorySelector";
import { SubcategorySelector } from "./SubcategorySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";
import { useClients } from "@/hooks/useClients";
import { Label } from "@/components/ui/label";
import { RegisterType } from "@/types";

export interface TransactionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  registerType: RegisterType;
  clientId?: string;
  initialDescription?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialSubcategory?: string;
  initialType?: "payment" | "refund" | "pending";
  disablePendingType?: boolean;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  isSubmitting,
  registerType,
  clientId: initialClientId,
  initialDescription = "",
  initialAmount,
  initialCategory,
  initialSubcategory,
  initialType = "payment",
  disablePendingType = false,
}: TransactionFormProps) {
  const [type, setType] = useState<"payment" | "refund" | "pending">(initialType);
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("card");
  const [description, setDescription] = useState(initialDescription);
  const [amount, setAmount] = useState(initialAmount ? initialAmount.toString() : "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory || null);
  const [clientId, setClientId] = useState(initialClientId || "");
  const [staffId, setStaffId] = useState("");

  const { data: staff, isLoading: isStaffLoading } = useStaff();
  const { data: clients, isLoading: isClientsLoading } = useClients();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount,
      type,
      method,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      clientId: clientId || null,
      staffId: staffId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description de la transaction"
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

      <TransactionTypeSelector 
        type={type} 
        onTypeChange={setType}
        disablePending={disablePendingType} 
      />

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
            <SelectItem value="">Aucun client</SelectItem>
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
            <SelectItem value="">Aucun personnel</SelectItem>
            {staff?.map((staffMember) => (
              <SelectItem key={staffMember.id} value={staffMember.id}>
                {staffMember.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "En cours..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
