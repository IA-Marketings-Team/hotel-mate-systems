
import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock } from "lucide-react";

const Blueprint = () => {
  const modules = [
    {
      name: "Gestion des Caisses",
      description: "Gestion des transactions pour l'hôtel, le restaurant et le poker.",
      status: "implemented",
      progress: 60,
      features: [
        { name: "Caisse Hôtellerie", status: "implemented" },
        { name: "Caisse Bar/Restauration", status: "implemented" },
        { name: "Caisse Poker/Jeux", status: "implemented" },
        { name: "Transactions", status: "implemented" },
        { name: "Sous-catégories dynamiques", status: "pending" },
        { name: "Menu hiérarchisé", status: "pending" },
        { name: "Gestion des événements", status: "pending" },
        { name: "Liaison avec l'inventaire", status: "pending" },
      ]
    },
    {
      name: "Gestion des Chambres",
      description: "Gestion complète des chambres, statuts et maintenance.",
      status: "implemented",
      progress: 70,
      features: [
        { name: "Statuts Dynamiques", status: "implemented" },
        { name: "Détails par Chambre", status: "implemented" },
        { name: "Caractéristiques", status: "implemented" },
        { name: "Options Supplémentaires", status: "pending" },
        { name: "Notes Libres", status: "implemented" },
        { name: "Maintenance", status: "pending" },
      ]
    },
    {
      name: "Gestion des Services",
      description: "Services hôteliers, restaurant et poker.",
      status: "implemented",
      progress: 60,
      features: [
        { name: "Services Annexes", status: "implemented" },
        { name: "Personnalisation", status: "pending" },
        { name: "Gestion des Menus", status: "pending" },
        { name: "Événements", status: "pending" },
        { name: "Gestion des Jeux", status: "pending" },
        { name: "Promotions", status: "pending" },
      ]
    },
    {
      name: "Gestion du Personnel",
      description: "Planning, présences et permissions.",
      status: "implemented",
      progress: 50,
      features: [
        { name: "Planning", status: "pending" },
        { name: "Calendrier Interactif", status: "pending" },
        { name: "Suivi des Présences", status: "pending" },
        { name: "Informations du Personnel", status: "implemented" },
        { name: "Permissions", status: "pending" },
      ]
    },
    {
      name: "Inventaire & Achats",
      description: "Gestion des stocks et commandes.",
      status: "pending",
      progress: 0,
      features: [
        { name: "Gestion des Stocks", status: "pending" },
        { name: "Articles Suivis", status: "pending" },
        { name: "Commandes", status: "pending" },
        { name: "Intégration Fournisseurs", status: "pending" },
      ]
    },
    {
      name: "Réservation & CRM",
      description: "Réservations et gestion des clients.",
      status: "in-progress",
      progress: 40,
      features: [
        { name: "Réservations", status: "implemented" },
        { name: "Calendrier Visuel", status: "pending" },
        { name: "Source de Réservation", status: "pending" },
        { name: "Fiche Client", status: "pending" },
        { name: "Profil Détaillé", status: "pending" },
        { name: "Feedback", status: "pending" },
      ]
    },
    {
      name: "Rapports Financiers",
      description: "Revenus et dépenses.",
      status: "in-progress",
      progress: 30,
      features: [
        { name: "Revenus par Service", status: "implemented" },
        { name: "Revenus par Client", status: "pending" },
        { name: "Dépenses", status: "pending" },
        { name: "Rentabilité", status: "pending" },
      ]
    },
    {
      name: "Interface Utilisateur",
      description: "Interface admin et réceptionniste.",
      status: "implemented",
      progress: 80,
      features: [
        { name: "Dashboard Centralisé", status: "implemented" },
        { name: "Widgets", status: "implemented" },
        { name: "Export de données", status: "pending" },
        { name: "Configuration", status: "pending" },
        { name: "Interface Simplifiée", status: "implemented" },
        { name: "Accès Mobile", status: "pending" },
      ]
    },
    {
      name: "Évolutions Futures",
      description: "Fonctionnalités à venir.",
      status: "pending",
      progress: 0,
      features: [
        { name: "Loyalty Program", status: "pending" },
        { name: "Application Mobile", status: "pending" },
        { name: "Terrasse/Rooftop", status: "pending" },
      ]
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implemented":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "pending":
        return <Circle className="h-5 w-5 text-gray-300" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "implemented":
        return "Implémenté";
      case "in-progress":
        return "En cours";
      case "pending":
        return "À faire";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "implemented":
        return "text-green-700 bg-green-100";
      case "in-progress":
        return "text-yellow-700 bg-yellow-100";
      case "pending":
        return "text-gray-500 bg-gray-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blueprint du Projet</h1>
      </div>

      <DashboardCard title="Progression globale">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">Progression totale</p>
              <p className="text-sm font-medium">45%</p>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">4</p>
              <p className="text-sm text-muted-foreground">Modules implémentés</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">2</p>
              <p className="text-sm text-muted-foreground">Modules en cours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">3</p>
              <p className="text-sm text-muted-foreground">Modules à faire</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">9</p>
              <p className="text-sm text-muted-foreground">Total modules</p>
            </div>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-6 grid-cols-1">
        {modules.map((module) => (
          <DashboardCard
            key={module.name}
            title={module.name}
            action={
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusClass(module.status)}`}>
                {getStatusText(module.status)}
              </div>
            }
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{module.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Progression</p>
                  <p className="text-sm font-medium">{module.progress}%</p>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-3">Fonctionnalités</h4>
                <ul className="space-y-2">
                  {module.features.map((feature) => (
                    <li key={feature.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(feature.status)}
                        <span className="text-sm">{feature.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(feature.status)}`}>
                        {getStatusText(feature.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
};

export default Blueprint;
