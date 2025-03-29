
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Edit, Trash, User, Mail, Phone, MapPin, Globe } from "lucide-react";
import { Client } from "@/types";
import { ClientForm } from "@/components/clients/ClientForm";

interface ClientInfoCardProps {
  client: Client;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleUpdate: (data: any) => void;
  handleDelete: () => void;
}

export const ClientInfoCard = ({
  client,
  isEditing,
  setIsEditing,
  handleUpdate,
  handleDelete
}: ClientInfoCardProps) => {
  return (
    <DashboardCard 
      title="Informations Client"
      action={
        !isEditing && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              Modifier
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
            >
              <Trash className="h-3.5 w-3.5 mr-1" />
              Supprimer
            </Button>
          </div>
        )
      }
    >
      <div className="p-4">
        {isEditing ? (
          <ClientForm 
            onSubmit={handleUpdate} 
            defaultValues={client}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{client.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Client depuis {client.createdAt ? format(new Date(client.createdAt), "MMMM yyyy") : "récemment"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </div>
              </div>

              {(client.address || client.city || client.postalCode || client.country) && (
                <div className="space-y-1.5">
                  {client.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <div>{client.address}</div>
                        {client.city && client.postalCode && (
                          <div>{client.postalCode} {client.city}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {client.country && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{client.country}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
