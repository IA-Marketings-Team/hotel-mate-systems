
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Bed, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RoomExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface RoomExtrasSelectorProps {
  extras: RoomExtra[];
  onChange: (extras: RoomExtra[]) => void;
}

const defaultExtras: RoomExtra[] = [
  { id: "extra-bed", name: "Lit supplémentaire", price: 50, quantity: 0 },
  { id: "extra-table", name: "Table supplémentaire", price: 25, quantity: 0 },
  { id: "extra-breakfast", name: "Petit déjeuner", price: 15, quantity: 0 },
  { id: "extra-parking", name: "Place de parking", price: 10, quantity: 0 },
];

export const RoomExtrasSelector: React.FC<RoomExtrasSelectorProps> = ({ 
  extras, 
  onChange 
}) => {
  const [selectedExtras, setSelectedExtras] = useState<RoomExtra[]>(
    extras.length ? extras : defaultExtras
  );

  const handleQuantityChange = (id: string, delta: number) => {
    const updatedExtras = selectedExtras.map(extra => {
      if (extra.id === id) {
        const newQuantity = Math.max(0, extra.quantity + delta);
        return { ...extra, quantity: newQuantity };
      }
      return extra;
    });
    
    setSelectedExtras(updatedExtras);
    onChange(updatedExtras.filter(extra => extra.quantity > 0));
  };

  const getExtraIcon = (name: string) => {
    if (name.toLowerCase().includes("lit")) return <Bed className="h-4 w-4 mr-2" />;
    if (name.toLowerCase().includes("table")) return <Table className="h-4 w-4 mr-2" />;
    return null;
  };

  return (
    <div className="space-y-4">
      <Label className="text-base">Extras</Label>
      <div className="space-y-2">
        {selectedExtras.map((extra) => (
          <div key={extra.id} className="flex items-center justify-between border p-3 rounded-md">
            <div className="flex items-center">
              {getExtraIcon(extra.name)}
              <span>{extra.name} - {extra.price}€</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleQuantityChange(extra.id, -1)}
                disabled={extra.quantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{extra.quantity}</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => handleQuantityChange(extra.id, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
