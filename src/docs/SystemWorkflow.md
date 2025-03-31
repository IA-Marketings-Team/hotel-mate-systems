
# Système de gestion hôtelière - Workflow détaillé

## 1. Gestion des chambres

### Vue d'ensemble des chambres
```mermaid
flowchart LR
    A[Liste des chambres] --> B{Filtrer}
    B --> C[Par statut]
    B --> D[Par type]
    B --> E[Par étage]
    
    A --> F{Actions}
    F --> G[Voir détails]
    F --> H[Changer statut]
    F --> I[Réserver]
    
    H --> J[Disponible]
    H --> K[Occupée]
    H --> L[Maintenance]
    H --> M[Nettoyage]
    
    I --> N[Processus de réservation]
```

### Processus de réservation
```mermaid
flowchart TD
    A[Sélectionner chambre] --> B[Choisir client]
    B --> C[Définir dates]
    C --> D[Ajouter extras]
    D --> E[Calculer prix]
    E --> F[Confirmer réservation]
    F --> G[Créer facture?]
    G -->|Oui| H[Générer facture]
    G -->|Non| I[Terminer]
    H --> I
```

## 2. Gestion du personnel

### Organisation des équipes
```mermaid
flowchart TD
    A[Vue des équipes] --> B[Créer équipe]
    A --> C[Modifier équipe]
    A --> D[Assigner membres]
    
    D --> E[Sélectionner employés]
    E --> F[Définir rôles]
    F --> G[Enregistrer]
```

### Planification des shifts
```mermaid
flowchart TD
    A[Calendrier] --> B[Vue hebdomadaire]
    A --> C[Vue par employé]
    
    B --> D[Ajouter planning]
    C --> D
    
    D --> E[Sélectionner employé]
    E --> F[Définir horaires]
    F --> G[Type de shift]
    G --> H[Créer tâches]
    H --> I[Enregistrer]
```

### Gestion des tâches
```mermaid
flowchart TD
    A[Liste des tâches] --> B{Filtrer par}
    B --> C[Statut]
    B --> D[Priorité]
    B --> E[Employé]
    
    A --> F[Nouvelle tâche]
    F --> G[Titre et description]
    G --> H[Priorité]
    H --> I[Assigner à]
    I --> J[Date d'échéance]
    J --> K[Vérifier planning]
    K -->|Planning existe| L[Lier au planning]
    K -->|Pas de planning| M[Créer planning]
    L --> N[Enregistrer]
    M --> N
```

## 3. Processus financiers

### Enregistrement des transactions
```mermaid
flowchart TD
    A[Sélectionner type] --> B[Entrée/Sortie]
    B --> C[Choisir catégorie]
    C --> D[Montant]
    D --> E[Méthode de paiement]
    E --> F[Client concerné?]
    F -->|Oui| G[Sélectionner client]
    F -->|Non| H[Transaction générale]
    G --> I[Enregistrer]
    H --> I
```

### Gestion des factures
```mermaid
flowchart TD
    A[Créer facture] --> B[Sélectionner client]
    B --> C[Ajouter éléments]
    C --> D[Appliquer remises?]
    D -->|Oui| E[Définir remise]
    D -->|Non| F[Calculer total]
    E --> F
    F --> G[Date d'échéance]
    G --> H[Générer facture]
    H --> I[Envoyer au client?]
    I -->|Oui| J[Envoi]
    I -->|Non| K[Enregistrer]
    J --> K
```

## 4. Interactions entre les modules

### Réservation et facturation
```mermaid
sequenceDiagram
    participant C as Client
    participant R as Réservation
    participant CH as Chambre
    participant F as Facture
    
    C->>R: Demande réservation
    R->>CH: Vérifie disponibilité
    CH-->>R: Confirmation disponibilité
    R->>C: Collecte informations
    R->>F: Crée facture
    F-->>C: Envoie facture
    C->>F: Effectue paiement
    F-->>R: Confirme paiement
    R->>CH: Confirme réservation
    CH-->>R: Mise à jour statut
    R-->>C: Confirmation finale
```

### Tâches et planning du personnel
```mermaid
sequenceDiagram
    participant M as Manager
    participant T as Tâche
    participant P as Planning
    participant E as Employé
    
    M->>T: Crée une tâche
    T->>P: Vérifie planning existant
    
    alt Planning existe
        P-->>T: Confirme disponibilité
        T->>P: Associe la tâche
    else Pas de planning
        T->>P: Crée nouveau planning
        P-->>T: Confirme création
    end
    
    T->>E: Assigne la tâche
    E-->>T: Reçoit notification
    E->>T: Met à jour statut
    T-->>M: Rapporte progression
```

## 5. Gestion des clients

### Parcours client
```mermaid
flowchart TD
    A[Nouveau client] --> B[Enregistrement]
    B --> C[Première réservation]
    C --> D[Séjour]
    D --> E[Services supplémentaires]
    E --> F[Checkout]
    F --> G[Facturation]
    G --> H[Paiement]
    H --> I[Historique client]
    I --> J[Nouvelle réservation]
    J --> D
```

### Actions sur profil client
```mermaid
flowchart TD
    A[Profil client] --> B{Actions}
    B --> C[Modifier informations]
    B --> D[Voir historique]
    B --> E[Créer réservation]
    B --> F[Ajouter transaction]
    B --> G[Générer facture]
    
    D --> H[Réservations passées]
    D --> I[Transactions]
    D --> J[Factures]
```

## 6. Architecture de l'application

### Flux de données
```mermaid
flowchart LR
    A[Interface utilisateur] <--> B[Hooks de données]
    B <--> C[API Supabase]
    C <--> D[Base de données PostgreSQL]
    
    E[Composants UI] --> A
    F[React Router] --> A
    G[React Context] --> A
    H[React Query] --> B
```

### Structure des composants
```mermaid
flowchart TD
    A[App] --> B[Layout]
    B --> C[Pages]
    
    C --> D[Dashboard]
    C --> E[Rooms]
    C --> F[Staff]
    C --> G[Clients]
    C --> H[Finances]
    C --> I[Services]
    
    D --> D1[DashboardCards]
    D --> D2[Stats]
    
    E --> E1[RoomList]
    E --> E2[RoomDetails]
    E --> E3[BookingForm]
    
    F --> F1[StaffDirectory]
    F --> F2[StaffScheduler]
    F --> F3[StaffTasks]
    
    G --> G1[ClientList]
    G --> G2[ClientDetails]
    G --> G3[ClientActions]
    
    H --> H1[Registers]
    H --> H2[Transactions]
    H --> H3[Invoices]
    
    I --> I1[ServicesList]
    I --> I2[ServiceBooking]
```

## 7. Points d'intégration

### Intégration avec systèmes externes
```mermaid
flowchart LR
    A[Système de gestion] --> B[API de paiement]
    A --> C[Service d'emails]
    A --> D[Exportation comptable]
    A --> E[Calendriers externes]
    A --> F[Systèmes de réservation en ligne]
```
