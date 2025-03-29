
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RegisterType } from "@/types";
import { CategorySelector } from "@/components/transactions/CategorySelector";
import { SubcategorySelector } from "@/components/transactions/SubcategorySelector";
import { useStaff } from "@/hooks/useStaff";
import { useClients } from "@/hooks/useClients";

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: {
    registerType?: RegisterType;
    clientId?: string;
    description?: string;
  };
}

export const InvoiceForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData = {}
}: InvoiceFormProps) => {
  // Form state
  const [method, setMethod] = useState<"cash" | "card" | "transfer">("card");
  const [description, setDescription] = useState(initialData.description || "");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [clientId, setClientId] = useState(initialData.clientId || "none");
  const [staffId, setStaffId] = useState("none");
  const [registerType, setRegisterType] = useState<RegisterType>(initialData.registerType || "hotel");
  const [dueDate, setDueDate] = useState<string>("");

  const { data: staff, isLoading: isStaffLoading } = useStaff();
  const { data: clients, isLoading: isClientsLoading } = useClients();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      description,
      amount: parseFloat(amount),
      clientId: clientId === "none" ? null : clientId,
      staffId: staffId === "none" ? null : staffId,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      registerType,
      dueDate: dueDate || undefined,
    });
  };

  return (
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

      <div>
        <Label htmlFor="dueDate">Date d'échéance</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "En cours..." : "Créer la facture"}
        </Button>
      </div>
    </form>
  );
};
