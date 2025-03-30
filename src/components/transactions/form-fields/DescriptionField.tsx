
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
}

export function DescriptionField({ description, setDescription }: DescriptionFieldProps) {
  return (
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
  );
}
