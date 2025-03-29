
import React from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Blueprint = () => {
  const modules = [
    {
      name: "Gestion des Caisses",
      description: "Gestion des transactions pour l'hôtel, le restaurant et le poker.",
      status: "in-progress",
      progress: 60,
      features: [
        { 
          name: "Caisse Hôtellerie", 
          status: "implemented",
          subfeatures: [
            { name: "Services: Chambres, buanderie, chauffeur, excursions, spa", status: "implemented" },
            { name: "Transactions: Paiements, remboursements, notes de frais", status: "implemented" },
            { name: "Sous-catégories dynamiques", status: "pending" }
          ]
        },
        { 
          name: "Caisse Bar/Restauration", 
          status: "implemented",
          subfeatures: [
            { name: "Menu hiérarchisé (boissons, plats)", status: "pending" },
            { name: "Gestion des événements", status: "pending" },
            { name: "Liaison avec l'inventaire", status: "pending" }
          ]
        },
        { 
          name: "Caisse Poker/Jeux", 
          status: "implemented",
          subfeatures: [
            { name: "Jeux: Texas Hold'em, Blackjack, machines à sous", status: "pending" },
            { name: "Tournois: Inscriptions, prix, historique", status: "pending" },
            { name: "Suivi des jetons et transactions", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Gestion des Chambres",
      description: "Gestion complète des chambres, statuts et maintenance.",
      status: "in-progress",
      progress: 70,
      features: [
        { 
          name: "Statuts Dynamiques", 
          status: "implemented",
          subfeatures: [
            { name: "Disponible, Occupé, En nettoyage, Hors service", status: "implemented" },
            { name: "Réinitialisation automatique quotidienne", status: "pending" }
          ]
        },
        { 
          name: "Détails par Chambre", 
          status: "implemented",
          subfeatures: [
            { name: "Caractéristiques (numéro, type, capacité, prix)", status: "implemented" },
            { name: "Options supplémentaires (lit d'appoint, berceau)", status: "pending" },
            { name: "Notes libres", status: "implemented" }
          ]
        },
        { 
          name: "Maintenance", 
          status: "pending",
          subfeatures: [
            { name: "Suivi des interventions", status: "pending" },
            { name: "Option de blocage manuel", status: "pending" },
            { name: "Alertes pour retards", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Gestion des Services",
      description: "Services hôteliers, restaurant et poker.",
      status: "in-progress",
      progress: 60,
      features: [
        { 
          name: "Hôtellerie", 
          status: "in-progress",
          subfeatures: [
            { name: "Services annexes (taxi, excursions, buanderie)", status: "implemented" },
            { name: "Personnalisation (nouveaux services, forfaits)", status: "pending" }
          ]
        },
        { 
          name: "Bar/Restauration", 
          status: "pending",
          subfeatures: [
            { name: "Gestion des menus (sous-catégories, options diététiques)", status: "pending" },
            { name: "Événements (réservation de salle, menu dédié)", status: "pending" }
          ]
        },
        { 
          name: "Poker/Jeux", 
          status: "pending",
          subfeatures: [
            { name: "Gestion des jeux (règles personnalisées, historique)", status: "pending" },
            { name: "Promotions (tournois à thème, récompenses)", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Gestion du Personnel",
      description: "Planning, présences et permissions.",
      status: "in-progress",
      progress: 50,
      features: [
        { 
          name: "Planning", 
          status: "pending",
          subfeatures: [
            { name: "Calendrier interactif", status: "pending" },
            { name: "Attribution des shifts", status: "pending" },
            { name: "Visualisation par service", status: "pending" },
            { name: "Alertes de chevauchement", status: "pending" }
          ]
        },
        { 
          name: "Suivi des Présences", 
          status: "pending",
          subfeatures: [
            { name: "Pointage électronique", status: "pending" },
            { name: "Rapport d'absences", status: "pending" }
          ]
        },
        { 
          name: "Informations du Personnel", 
          status: "implemented",
          subfeatures: [
            { name: "Fiche détaillée (rôle, contact, service)", status: "implemented" },
            { name: "Statut de disponibilité", status: "implemented" }
          ]
        },
        { 
          name: "Permissions", 
          status: "pending",
          subfeatures: [
            { name: "Accès différenciés", status: "pending" },
            { name: "Journal des actions critiques", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Inventaire & Achats",
      description: "Gestion des stocks et commandes.",
      status: "pending",
      progress: 0,
      features: [
        { 
          name: "Gestion des Stocks", 
          status: "pending",
          subfeatures: [
            { name: "Articles suivis", status: "pending" },
            { name: "Seuils d'alerte", status: "pending" }
          ]
        },
        { 
          name: "Commandes", 
          status: "pending",
          subfeatures: [
            { name: "Création de demandes d'achat", status: "pending" },
            { name: "Comparaison de devis", status: "pending" },
            { name: "Archivage des factures", status: "pending" }
          ]
        },
        { 
          name: "Intégration Fournisseurs", 
          status: "pending",
          subfeatures: [
            { name: "Catalogue en ligne", status: "pending" },
            { name: "Commandes automatisées", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Réservation & CRM",
      description: "Réservations et gestion des clients.",
      status: "in-progress",
      progress: 40,
      features: [
        { 
          name: "Réservations", 
          status: "in-progress",
          subfeatures: [
            { name: "Calendrier visuel", status: "pending" },
            { name: "Glisser-déposer pour modification", status: "pending" },
            { name: "Système de réservation", status: "implemented" }
          ]
        },
        { 
          name: "Source de Réservation", 
          status: "pending",
          subfeatures: [
            { name: "Options de sources", status: "pending" },
            { name: "Analyse de performance", status: "pending" }
          ]
        },
        { 
          name: "Fiche Client", 
          status: "pending",
          subfeatures: [
            { name: "Profil détaillé", status: "pending" },
            { name: "Historique des séjours", status: "pending" },
            { name: "Documents", status: "pending" }
          ]
        },
        { 
          name: "Feedback", 
          status: "pending",
          subfeatures: [
            { name: "Formulaire de satisfaction", status: "pending" },
            { name: "Analyse des commentaires", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Rapports Financiers",
      description: "Revenus et dépenses.",
      status: "in-progress",
      progress: 30,
      features: [
        { 
          name: "Revenus", 
          status: "in-progress",
          subfeatures: [
            { name: "Par service (comparatif journalier/mensuel)", status: "implemented" },
            { name: "Tendances saisonnières", status: "pending" },
            { name: "Par client (dépenses moyennes, historique)", status: "pending" }
          ]
        },
        { 
          name: "Dépenses", 
          status: "pending",
          subfeatures: [
            { name: "Catégories (salaires, achats, maintenance)", status: "pending" },
            { name: "Suivi des dépenses", status: "pending" }
          ]
        },
        { 
          name: "Rentabilité", 
          status: "pending",
          subfeatures: [
            { name: "Marge par service", status: "pending" },
            { name: "Alertes de dépassement de budget", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Interface Utilisateur",
      description: "Interface admin et réceptionniste.",
      status: "in-progress",
      progress: 80,
      features: [
        { 
          name: "Admin", 
          status: "implemented",
          subfeatures: [
            { name: "Dashboard centralisé", status: "implemented" },
            { name: "Widgets (taux d'occupation, revenus)", status: "implemented" },
            { name: "Export de données", status: "pending" }
          ]
        },
        { 
          name: "Configuration", 
          status: "pending",
          subfeatures: [
            { name: "Ajout de catégories", status: "pending" },
            { name: "Modification des tarifs", status: "pending" },
            { name: "Gestion des droits", status: "pending" }
          ]
        },
        { 
          name: "Interface Réceptionniste", 
          status: "implemented",
          subfeatures: [
            { name: "Interface simplifiée", status: "implemented" },
            { name: "Icônes intuitives", status: "implemented" },
            { name: "Scanner de QR code", status: "pending" }
          ]
        },
        { 
          name: "Accès Mobile", 
          status: "pending",
          subfeatures: [
            { name: "Version responsive", status: "implemented" },
            { name: "Marquage des chambres", status: "pending" },
            { name: "Consultation des notes clients", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Évolutions Futures",
      description: "Fonctionnalités à venir.",
      status: "pending",
      progress: 0,
      features: [
        { 
          name: "Loyalty Program", 
          status: "pending",
          subfeatures: [
            { name: "Points cumulables", status: "pending" },
            { name: "Récompenses", status: "pending" }
          ]
        },
        { 
          name: "Application Mobile", 
          status: "pending",
          subfeatures: [
            { name: "Pour clients", status: "pending" },
            { name: "Pour personnel", status: "pending" }
          ]
        },
        { 
          name: "Terrasse/Rooftop", 
          status: "pending",
          subfeatures: [
            { name: "Module annexe", status: "pending" },
            { name: "Menu saisonnier", status: "pending" },
            { name: "Gestion de réservations spécifiques", status: "pending" }
          ]
        }
      ]
    },
    {
      name: "Exigences Non-Fonctionnelles",
      description: "Sécurité, interopérabilité, évolutivité.",
      status: "in-progress",
      progress: 30,
      features: [
        { 
          name: "Sécurité", 
          status: "in-progress",
          subfeatures: [
            { name: "Chiffrement des données clients", status: "implemented" },
            { name: "Sauvegardes quotidiennes", status: "pending" }
          ]
        },
        { 
          name: "Interopérabilité", 
          status: "in-progress",
          subfeatures: [
            { name: "Intégration avec outils externes", status: "in-progress" },
            { name: "Systèmes de paiement", status: "pending" }
          ]
        },
        { 
          name: "Évolutivité", 
          status: "implemented",
          subfeatures: [
            { name: "Architecture modulaire", status: "implemented" },
            { name: "Ajout de nouveaux services", status: "implemented" }
          ]
        }
      ]
    }
  ];

  // Calculate overall progress
  const calculateOverallProgress = () => {
    let totalFeatures = 0;
    let implementedFeatures = 0;
    let inProgressFeatures = 0;

    modules.forEach(module => {
      module.features.forEach(feature => {
        totalFeatures++;
        if (feature.status === "implemented") implementedFeatures++;
        if (feature.status === "in-progress") inProgressFeatures += 0.5;
      });
    });

    return Math.round((implementedFeatures + inProgressFeatures) / totalFeatures * 100);
  };

  const getImplementedModulesCount = () => {
    return modules.filter(module => module.status === "implemented").length;
  };

  const getInProgressModulesCount = () => {
    return modules.filter(module => module.status === "in-progress").length;
  };

  const getPendingModulesCount = () => {
    return modules.filter(module => module.status === "pending").length;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "implemented":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "pending":
        return <Circle className="h-5 w-5 text-gray-300" />;
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
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
      case "blocked":
        return "Bloqué";
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
      case "blocked":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const overallProgress = calculateOverallProgress();

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
              <p className="text-sm font-medium">{overallProgress}%</p>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{getImplementedModulesCount()}</p>
              <p className="text-sm text-muted-foreground">Modules implémentés</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{getInProgressModulesCount()}</p>
              <p className="text-sm text-muted-foreground">Modules en cours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{getPendingModulesCount()}</p>
              <p className="text-sm text-muted-foreground">Modules à faire</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{modules.length}</p>
              <p className="text-sm text-muted-foreground">Total modules</p>
            </div>
          </div>
        </div>
      </DashboardCard>

      <ScrollArea className="h-[calc(100vh-280px)]">
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
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="features">
                    <AccordionTrigger className="font-medium">Fonctionnalités</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-6">
                        {module.features.map((feature) => (
                          <li key={feature.name} className="space-y-2">
                            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(feature.status)}
                                <span className="font-medium">{feature.name}</span>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(feature.status)}`}>
                                {getStatusText(feature.status)}
                              </span>
                            </div>
                            
                            {feature.subfeatures && (
                              <ul className="pl-6 space-y-2 mt-2">
                                {feature.subfeatures.map((subfeature) => (
                                  <li key={subfeature.name} className="flex items-center justify-between p-1 border-l-2 border-muted">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(subfeature.status)}
                                      <span className="text-sm">{subfeature.name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(subfeature.status)}`}>
                                      {getStatusText(subfeature.status)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </DashboardCard>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Blueprint;
