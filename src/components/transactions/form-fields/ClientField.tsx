
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClients } from "@/hooks/useClients";

interface ClientFieldProps {
  clientId: string;
  setClientId: (value: string) => void;
}

export function ClientField({ clientId, setClientId }: ClientFieldProps) {
  const { data: clients, isLoading: isClientsLoading } = useClients();

  return (
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
  );
}
