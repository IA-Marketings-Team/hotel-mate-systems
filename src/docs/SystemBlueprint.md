
# Système de Gestion du Personnel et des Tâches - Architecture

Ce document présente l'architecture et les composants clés du système de gestion du personnel et des tâches.

## Architecture globale

```mermaid
flowchart TD
    A[Module Personnel] --> B[Gestion des employés]
    A --> C[Planification]
    A --> D[Gestion des tâches]
    
    B --> B1[Annuaire]
    B --> B2[Profils]
    B --> B3[Disponibilité]
    
    C --> C1[Calendrier]
    C --> C2[Plannings]
    C --> C3[Services]
    
    D --> D1[Liste des tâches]
    D --> D2[Attribution]
    D --> D3[Suivi]
    
    %% Interactions entre composants
    B1 <--> C2
    C2 <--> D2
    B3 <--> C1
    D1 <--> D3
```

## Structure des données

```mermaid
erDiagram
    STAFF {
        uuid id PK
        string name
        string role
        string email
        string contact_number
        string shift
        bool is_available
    }
    
    SHIFTS {
        uuid id PK
        uuid staff_id FK
        date date
        string start_time
        string end_time
        string type
    }
    
    TASKS {
        uuid id PK
        uuid assigned_to FK
        date due_date
        string title
        string description
        string priority
        string status
    }
    
    STAFF ||--o{ SHIFTS : "est planifié"
    STAFF ||--o{ TASKS : "est assigné"
    SHIFTS ||--o{ TASKS : "contient"
```

## Flux de création de tâches

```mermaid
flowchart TD
    A[Début] --> B{Créer depuis?}
    
    B -->|Planning existant| C[Ouvrir ShiftDialog]
    B -->|Module de tâches| D[Ouvrir IndependentTaskDialog]
    B -->|Page ShiftTasks| E[Ouvrir CreateTaskDialog]
    
    C --> F[Sélectionner employé]
    C --> G[Définir horaires]
    C --> H[Ajouter tâche]
    H --> I[Enregistrer planning et tâche]
    
    D --> J[Sélectionner employé]
    D --> K[Définir date]
    D --> L[Créer tâche]
    L --> M{Planning existant?}
    M -->|Oui| N[Associer au planning]
    M -->|Non| O[Créer planning automatique]
    N --> P[Enregistrer tâche]
    O --> P
    
    E --> Q[Définir tâche]
    Q --> R[Enregistrer dans le planning existant]
    
    I --> S[Fin]
    P --> S
    R --> S
```

## Flux de gestion des statuts de tâches

```mermaid
stateDiagram-v2
    [*] --> Pending: Création de tâche
    Pending --> InProgress: Début d'exécution
    InProgress --> Completed: Finalisation
    Completed --> Pending: Réouverture si besoin
    Pending --> [*]: Suppression
    InProgress --> [*]: Suppression
    Completed --> [*]: Suppression
```
