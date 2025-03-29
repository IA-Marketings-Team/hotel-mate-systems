
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockServices } from "@/lib/mock-data";
import { HotelService } from "@/types";
import { Search, Clock, Check, X, Euro, MoreHorizontal } from "lucide-react";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const getCategoryName = (category: string) => {
    switch (category) {
      case "taxi":
        return "Taxi";
      case "excursion":
        return "Excursion";
      case "laundry":
        return "Blanchisserie";
      case "spa":
        return "Spa";
      case "restaurant":
        return "Restaurant";
      case "other":
        return "Autre";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "taxi":
        return "bg-yellow-100 text-yellow-800";
      case "excursion":
        return "bg-green-100 text-green-800";
      case "laundry":
        return "bg-blue-100 text-blue-800";
      case "spa":
        return "bg-purple-100 text-purple-800";
      case "restaurant":
        return "bg-red-100 text-red-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredServices = mockServices.filter((service) => {
    // Search term filter
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const formatDuration = (minutes: number | undefined) => {
    if (!minutes) return "N/A";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} h`;
    } else {
      return `${hours} h ${mins} min`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button>Ajouter un service</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un service..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="taxi">Taxi</SelectItem>
            <SelectItem value="excursion">Excursion</SelectItem>
            <SelectItem value="laundry">Blanchisserie</SelectItem>
            <SelectItem value="spa">Spa</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => (
          <div key={service.id} className="hotel-card hover:shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">{service.name}</h3>
              <Badge className={getCategoryColor(service.category)}>
                {getCategoryName(service.category)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {service.description}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Euro className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Prix:</span>
                </div>
                <span className="text-sm font-medium">{service.price} €</span>
              </div>
              {service.duration && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Durée:</span>
                  </div>
                  <span className="text-sm font-medium">{formatDuration(service.duration)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Disponible:</span>
                {service.available ? (
                  <div className="flex items-center gap-1 text-green-500">
                    <Check className="size-4" />
                    <span className="text-sm font-medium">Oui</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500">
                    <X className="size-4" />
                    <span className="text-sm font-medium">Non</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" size="sm">
                Modifier
              </Button>
              <Button variant="default" size="sm">
                Réserver
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
