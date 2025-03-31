
# Système de gestion hôtelière - Blueprint et workflow

## Architecture du système

Le système de gestion hôtelière est composé de plusieurs modules interconnectés:

1. **Gestion des chambres**
   - Affichage des chambres disponibles
   - Détails des chambres
   - Maintenance et nettoyage
   - Réservation des chambres

2. **Gestion du personnel**
   - Annuaire du personnel
   - Planning des équipes
   - Assignation des tâches
   - Suivi des performances

3. **Gestion des clients**
   - Enregistrement des clients
   - Historique des séjours
   - Préférences et notes
   - Facturation

4. **Gestion financière**
   - Registres des transactions
   - Facturation
   - Paiements
   - Rapports financiers

5. **Gestion des services**
   - Services disponibles
   - Réservations de services
   - Tarification

## Diagramme de structure

```mermaid
graph TD
    A[Application de gestion hôtelière] --> B[Gestion des chambres]
    A --> C[Gestion du personnel]
    A --> D[Gestion des clients]
    A --> E[Gestion financière]
    A --> F[Gestion des services]
    
    B --> B1[Liste des chambres]
    B --> B2[Détails des chambres]
    B --> B3[Réservation]
    B --> B4[Maintenance/Nettoyage]
    
    C --> C1[Annuaire du personnel]
    C --> C2[Planning]
    C --> C3[Gestion des tâches]
    C --> C4[Équipes]
    
    D --> D1[Liste des clients]
    D --> D2[Profil client]
    D --> D3[Historique des séjours]
    
    E --> E1[Registres des caisses]
    E --> E2[Transactions]
    E --> E3[Factures]
    
    F --> F1[Catalogue de services]
    F --> F2[Réservations de services]
```

## Workflow de planification et tâches

```mermaid
flowchart TD
    A[Début] --> B{Type d'action?}
    
    %% Chemin 1: Création d'une planification
    B -->|Création planification| C[Créer une planification]
    C --> D[Définir période de planification]
    D --> E[Sélectionner employé cible]
    E --> F[Créer au moins une tâche liée]
    F --> G[Définir détails de la tâche]
    G --> H[Assigner automatiquement la tâche à l'employé cible]
    H --> I[Enregistrer la planification et la tâche]
    I --> J[Notifier l'employé]
    J --> Z[Fin]
    
    %% Chemin 2: Création d'une tâche avec assignation
    B -->|Création tâche| K[Créer une tâche]
    K --> L[Définir détails de la tâche]
    L --> M[Assigner à un employé]
    M --> N[Vérifier si période de planification existe pour l'employé]
    N -->|Existe| O[Lier la tâche à la planification existante]
    N -->|N'existe pas| P[Créer automatiquement une planification]
    P --> Q[Définir période de planification basée sur la tâche]
    Q --> R[Lier la tâche à la nouvelle planification]
    O --> S[Enregistrer les modifications]
    R --> S
    S --> T[Notifier l'employé]
    T --> Z
    
    %% Légende
    classDef planification fill:#f9d5e5,stroke:#333,stroke-width:1px
    classDef tache fill:#eeeeee,stroke:#333,stroke-width:1px
    classDef notification fill:#d5f9e5,stroke:#333,stroke-width:1px
    
    class C,D,E,P,Q,R planification
    class F,G,H,K,L,M,O tache
    class J,T notification
```

## Workflow de réservation de chambre

```mermaid
flowchart TD
    A[Début] --> B[Sélectionner une chambre disponible]
    B --> C[Choisir un client existant ou créer un nouveau]
    C --> D[Définir les dates de séjour]
    D --> E[Sélectionner des extras optionnels]
    E --> F[Calculer le montant total]
    F --> G[Confirmer la réservation]
    G --> H{Création d'une facture?}
    H -->|Oui| I[Générer une facture]
    H -->|Non| J[Enregistrer sans facture]
    I --> K[Enregistrer le paiement]
    J --> L[Fin]
    K --> L
```

## Workflow de gestion des tâches du personnel

```mermaid
flowchart TD
    A[Début] --> B[Afficher le planning du personnel]
    B --> C{Action souhaitée?}
    
    C -->|Créer tâche| D[Créer une nouvelle tâche]
    D --> E[Assigner à un membre du personnel]
    E --> F[Définir priorité et échéance]
    F --> G[Enregistrer la tâche]
    
    C -->|Modifier tâche| H[Sélectionner une tâche existante]
    H --> I[Modifier les détails de la tâche]
    I --> J[Mettre à jour la tâche]
    
    C -->|Changer statut| K[Sélectionner une tâche]
    K --> L[Changer le statut]
    L --> M[Enregistrer le changement]
    
    G --> N[Fin]
    J --> N
    M --> N
```

## Structure de la base de données

Principales tables et leurs relations:

```mermaid
erDiagram
    ROOMS {
        uuid id PK
        text number
        text type
        text status
        numeric price_per_night
        text current_guest
        boolean maintenance_status
        boolean cleaning_status
    }
    
    CLIENTS {
        uuid id PK
        text name
        text email
        text phone
        text address
    }
    
    BOOKINGS {
        uuid id PK
        uuid room_id FK
        uuid client_id FK
        timestamp check_in
        timestamp check_out
        numeric amount
        text status
        jsonb extras
    }
    
    STAFF {
        uuid id PK
        text name
        text role
        text email
        text contact_number
        boolean is_available
    }
    
    SHIFTS {
        uuid id PK
        uuid staff_id FK
        date date
        time start_time
        time end_time
        text type
    }
    
    TASKS {
        uuid id PK
        uuid assigned_to FK
        text title
        text description
        text priority
        text status
        date due_date
    }
    
    TRANSACTIONS {
        uuid id PK
        timestamp date
        numeric amount
        uuid staff_id FK
        uuid client_id FK
        text type
        text method
        text register_type
    }
    
    ROOMS ||--o{ BOOKINGS : "a"
    CLIENTS ||--o{ BOOKINGS : "fait"
    STAFF ||--o{ SHIFTS : "a"
    STAFF ||--o{ TASKS : "assigné à"
    CLIENTS ||--o{ TRANSACTIONS : "associé à"
    STAFF ||--o{ TRANSACTIONS : "enregistré par"
```

## Flux d'interaction utilisateur

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant I as Interface
    participant A as API
    participant DB as Base de données
    
    U->>I: Accède au système
    I->>A: Récupère données initiales
    A->>DB: Requête données
    DB-->>A: Retourne données
    A-->>I: Affiche tableau de bord
    
    Note over U,I: Interaction avec le système
    
    U->>I: Crée une réservation
    I->>A: Envoie données réservation
    A->>DB: Enregistre la réservation
    A->>DB: Met à jour statut chambre
    DB-->>A: Confirmation
    A-->>I: Affiche confirmation
    I-->>U: Notification de succès
    
    U->>I: Assigne tâche à un employé
    I->>A: Envoie données tâche
    A->>DB: Enregistre la tâche
    A->>DB: Associe à un planning
    DB-->>A: Confirmation
    A-->>I: Mise à jour interface
    I-->>U: Confirmation visuelle
```

## Technologies utilisées

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Gestion d'état**: React Context, React Query
- **Routage**: React Router
- **Backend**: Supabase (PostgreSQL)
- **Visualisation**: Charts (recharts)
- **Dates**: date-fns
- **Notifications**: sonner
- **Formulaires**: react-hook-form

## Principes de conception

1. **Interface responsive** - Fonctionne sur tous les appareils
2. **Navigation intuitive** - Structure logique et accès rapide aux fonctions clés
3. **Design moderne** - UI claire et élégante avec Tailwind et Shadcn/UI
4. **Performance optimisée** - Utilisation de React Query pour la gestion des données
5. **Architecture modulaire** - Composants réutilisables et maintenables
