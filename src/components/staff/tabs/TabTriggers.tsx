
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, ListTodo, UserCog } from "lucide-react";

export const TabTriggers: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-5 mb-8">
      <TabsTrigger value="directory" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Annuaire</span>
      </TabsTrigger>
      <TabsTrigger value="scheduler" className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Planning</span>
      </TabsTrigger>
      <TabsTrigger value="tasks" className="flex items-center gap-2">
        <ListTodo className="h-4 w-4" />
        <span className="hidden sm:inline">Tâches</span>
      </TabsTrigger>
      <TabsTrigger value="teams" className="flex items-center gap-2">
        <UserCog className="h-4 w-4" />
        <span className="hidden sm:inline">Équipes</span>
      </TabsTrigger>
      <TabsTrigger value="tracking" className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Suivi</span>
      </TabsTrigger>
    </TabsList>
  );
};
