
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterType } from "@/types";
import { Hotel, Utensils, CircleDollarSign, Umbrella } from "lucide-react";

interface RegisterTabsProps {
  activeTab: RegisterType;
  onTabChange: (value: RegisterType) => void;
}

export function RegisterTabs({ activeTab, onTabChange }: RegisterTabsProps) {
  return (
    <TabsList className="grid grid-cols-4 mb-6">
      <TabsTrigger 
        value="hotel" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("hotel")}
      >
        <Hotel className="size-4" />
        <span>Hôtellerie</span>
      </TabsTrigger>
      <TabsTrigger 
        value="restaurant" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("restaurant")}
      >
        <Utensils className="size-4" />
        <span>Restaurant</span>
      </TabsTrigger>
      <TabsTrigger 
        value="poker" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("poker")}
      >
        <CircleDollarSign className="size-4" />
        <span>Poker</span>
      </TabsTrigger>
      <TabsTrigger 
        value="rooftop" 
        className="flex items-center gap-2"
        onClick={() => onTabChange("rooftop")}
      >
        <Umbrella className="size-4" />
        <span>Rooftop</span>
      </TabsTrigger>
    </TabsList>
  );
}
