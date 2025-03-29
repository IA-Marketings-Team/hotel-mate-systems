
import { Room, StaffMember, HotelService, Transaction, DashboardStat } from "@/types";
import { Hotel, Users, Bed, Utensils, CreditCard, DollarSign, Calendar } from "lucide-react";

// Mock Rooms
export const mockRooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "standard",
    capacity: 2,
    pricePerNight: 120,
    floor: 1,
    view: "garden",
    status: "available",
    features: ["WiFi", "TV", "Mini-Bar"],
    notes: "",
    lastCleaned: new Date(),
    maintenanceStatus: false,
    cleaningStatus: false
  },
  {
    id: "2",
    number: "102",
    type: "standard",
    capacity: 2,
    pricePerNight: 120,
    floor: 1,
    view: "garden",
    status: "occupied",
    features: ["WiFi", "TV", "Mini-Bar"],
    notes: "Client a demandé des oreillers supplémentaires",
    lastCleaned: new Date(Date.now() - 86400000),
    currentGuest: "Jean Dupont",
    maintenanceStatus: false,
    cleaningStatus: false
  },
  {
    id: "3",
    number: "103",
    type: "deluxe",
    capacity: 3,
    pricePerNight: 180,
    floor: 1,
    view: "pool",
    status: "available", // Changed from "cleaning" to "available"
    features: ["WiFi", "TV", "Mini-Bar", "Jacuzzi"],
    notes: "",
    lastCleaned: new Date(Date.now() - 172800000),
    maintenanceStatus: false,
    cleaningStatus: true // Set to true to indicate it needs cleaning
  },
  {
    id: "4",
    number: "201",
    type: "suite",
    capacity: 4,
    pricePerNight: 250,
    floor: 2,
    view: "sea",
    status: "available", // Changed from "maintenance" to "available"
    features: ["WiFi", "TV", "Mini-Bar", "Jacuzzi", "Balcon"],
    notes: "Problème de climatisation",
    lastCleaned: new Date(Date.now() - 259200000),
    maintenanceStatus: true, // Set to true to indicate it's in maintenance
    cleaningStatus: false
  },
  {
    id: "5",
    number: "202",
    type: "suite",
    capacity: 4,
    pricePerNight: 250,
    floor: 2,
    view: "sea",
    status: "available",
    features: ["WiFi", "TV", "Mini-Bar", "Jacuzzi", "Balcon"],
    notes: "",
    lastCleaned: new Date(),
    maintenanceStatus: false,
    cleaningStatus: false
  },
  {
    id: "6",
    number: "301",
    type: "presidential",
    capacity: 6,
    pricePerNight: 500,
    floor: 3,
    view: "sea",
    status: "occupied",
    features: ["WiFi", "TV", "Mini-Bar", "Jacuzzi", "Balcon", "Cuisine"],
    notes: "VIP - PDG de XYZ Corp",
    lastCleaned: new Date(Date.now() - 86400000),
    currentGuest: "Marcel Richard",
    maintenanceStatus: false,
    cleaningStatus: false
  },
];

// Mock Staff
export const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sophie Martin",
    role: "manager",
    contactNumber: "0123456789",
    email: "sophie.martin@hotelmate.com",
    shift: "morning",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Thomas Bernard",
    role: "receptionist",
    contactNumber: "0123456788",
    email: "thomas.bernard@hotelmate.com",
    shift: "morning",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Julie Petit",
    role: "receptionist",
    contactNumber: "0123456787",
    email: "julie.petit@hotelmate.com",
    shift: "afternoon",
    isAvailable: false,
  },
  {
    id: "4",
    name: "Marc Dubois",
    role: "housekeeper",
    contactNumber: "0123456786",
    email: "marc.dubois@hotelmate.com",
    shift: "morning",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Emilie Roux",
    role: "housekeeper",
    contactNumber: "0123456785",
    email: "emilie.roux@hotelmate.com",
    shift: "afternoon",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Pierre Leroy",
    role: "chef",
    contactNumber: "0123456784",
    email: "pierre.leroy@hotelmate.com",
    shift: "morning",
    isAvailable: true,
  },
  {
    id: "7",
    name: "Marie Moreau",
    role: "waiter",
    contactNumber: "0123456783",
    email: "marie.moreau@hotelmate.com",
    shift: "afternoon",
    isAvailable: true,
  },
  {
    id: "8",
    name: "Lucas Fournier",
    role: "bartender",
    contactNumber: "0123456782",
    email: "lucas.fournier@hotelmate.com",
    shift: "night",
    isAvailable: true,
  },
  {
    id: "9",
    name: "Camille Girard",
    role: "maintenance",
    contactNumber: "0123456781",
    email: "camille.girard@hotelmate.com",
    shift: "morning",
    isAvailable: false,
  },
];

// Mock Services
export const mockServices: HotelService[] = [
  {
    id: "1",
    name: "Taxi à l'aéroport",
    category: "taxi",
    description: "Service de navette vers l'aéroport",
    price: 50,
    duration: 30,
    available: true,
  },
  {
    id: "2",
    name: "Visite de la ville",
    category: "excursion",
    description: "Visite guidée des principaux monuments",
    price: 35,
    duration: 180,
    available: true,
  },
  {
    id: "3",
    name: "Randonnée en montagne",
    category: "excursion",
    description: "Randonnée de 4h avec guide",
    price: 45,
    duration: 240,
    available: true,
  },
  {
    id: "4",
    name: "Blanchisserie",
    category: "laundry",
    description: "Service de nettoyage de vêtements",
    price: 15,
    duration: 120,
    available: true,
  },
  {
    id: "5",
    name: "Massage relaxant",
    category: "spa",
    description: "Massage de 60 minutes",
    price: 80,
    duration: 60,
    available: true,
  },
  {
    id: "6",
    name: "Dîner aux chandelles",
    category: "restaurant",
    description: "Dîner romantique pour deux",
    price: 120,
    duration: 120,
    available: true,
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date(),
    amount: 250,
    type: "payment",
    method: "card",
    registerType: "hotel",
    description: "Chambre 202 - 1 nuit",
    staffId: "2",
    clientId: "client1",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000),
    amount: 80,
    type: "payment",
    method: "cash",
    registerType: "restaurant",
    description: "Dîner - Table 5",
    staffId: "7",
    clientId: "client2",
  },
  {
    id: "3",
    date: new Date(Date.now() - 172800000),
    amount: 100,
    type: "payment",
    method: "card",
    registerType: "poker",
    description: "Achat de jetons",
    staffId: "8",
    clientId: "client3",
  },
  {
    id: "4",
    date: new Date(Date.now() - 259200000),
    amount: 25,
    type: "refund",
    method: "cash",
    registerType: "hotel",
    description: "Remboursement minibar non utilisé",
    staffId: "2",
    clientId: "client4",
  },
  {
    id: "5",
    date: new Date(Date.now() - 345600000),
    amount: 45,
    type: "payment",
    method: "card",
    registerType: "hotel",
    description: "Excursion montagne",
    staffId: "2",
    clientId: "client5",
  },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStat[] = [
  {
    title: "Taux d'occupation",
    value: "68%",
    change: 12,
    icon: "Hotel",
    color: "hotel-primary",
  },
  {
    title: "Revenu journalier",
    value: "3 450 €",
    change: 8,
    icon: "DollarSign",
    color: "hotel-success",
  },
  {
    title: "Réservations",
    value: "24",
    change: -3,
    icon: "Calendar",
    color: "hotel-info",
  },
  {
    title: "Personnel actif",
    value: "15",
    change: 0,
    icon: "Users",
    color: "hotel-secondary",
  },
];

// Room Status Counts
export const mockRoomStatusCounts = {
  available: 10,
  occupied: 25,
  cleaning: 8,
  maintenance: 3,
};

// Recent Bookings
export const mockRecentBookings = [
  {
    id: "1",
    guest: "Jean Dupont",
    room: "102",
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 259200000),
    status: "checked-in",
    amount: 360,
  },
  {
    id: "2",
    guest: "Marie Laurent",
    room: "301",
    checkIn: new Date(Date.now() - 86400000),
    checkOut: new Date(Date.now() + 345600000),
    status: "checked-in",
    amount: 2000,
  },
  {
    id: "3",
    guest: "Bernard Michel",
    room: "205",
    checkIn: new Date(Date.now() + 172800000),
    checkOut: new Date(Date.now() + 518400000),
    status: "confirmed",
    amount: 720,
  },
  {
    id: "4",
    guest: "Sophie Petit",
    room: "110",
    checkIn: new Date(Date.now() + 259200000),
    checkOut: new Date(Date.now() + 604800000),
    status: "confirmed",
    amount: 840,
  },
];

// Revenue by Service
export const mockRevenueByService = [
  { name: "Chambres", value: 15400 },
  { name: "Restaurant", value: 4800 },
  { name: "Bar", value: 2100 },
  { name: "Spa", value: 1400 },
  { name: "Excursions", value: 950 },
];

// Monthly Revenue
export const mockMonthlyRevenue = [
  { name: "Jan", revenue: 24500 },
  { name: "Fév", revenue: 21800 },
  { name: "Mar", revenue: 28300 },
  { name: "Avr", revenue: 32100 },
  { name: "Mai", revenue: 37400 },
  { name: "Jui", revenue: 43800 },
  { name: "Jui", revenue: 52300 },
  { name: "Aoû", revenue: 58700 },
  { name: "Sep", revenue: 45200 },
  { name: "Oct", revenue: 39800 },
  { name: "Nov", revenue: 31500 },
  { name: "Déc", revenue: 42700 },
];
