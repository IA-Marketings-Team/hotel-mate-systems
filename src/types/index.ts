// Room Types
export type RoomStatus = 'available' | 'occupied';

export interface Room {
  id: string;
  number: string;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  capacity: number;
  pricePerNight: number;
  floor: number;
  view: 'garden' | 'pool' | 'sea' | 'mountain' | 'city';
  status: RoomStatus; // État principal (uniquement disponible ou occupé)
  maintenanceStatus: boolean; // Indique si la chambre est en maintenance
  cleaningStatus: boolean; // Indique si la chambre est en nettoyage ou à nettoyer
  features: string[];
  notes: string;
  lastCleaned?: Date;
  currentGuest?: string;
}

// Staff Types
export type StaffRole = 'manager' | 'receptionist' | 'housekeeper' | 'waiter' | 'chef' | 'bartender' | 'maintenance';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  contactNumber: string;
  email: string;
  shift: 'morning' | 'afternoon' | 'night';
  isAvailable: boolean;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Room Extra
export interface BookingExtra {
  name: string;
  price: number;
  quantity: number;
}

// Booking Types
export type BookingType = 'room' | 'meeting' | 'car' | 'terrace' | 'restaurant';
export type BookingStatus = 'confirmed' | 'canceled' | 'completed';

export interface Booking {
  id: string;
  resourceId?: string;
  roomId?: string;
  guestName: string;
  clientId?: string;
  checkIn: Date;
  checkOut: Date;
  amount: number;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  bookingType: BookingType;
  extras?: BookingExtra[];
}

// Service Types
export interface HotelService {
  id: string;
  name: string;
  category: 'taxi' | 'excursion' | 'laundry' | 'spa' | 'restaurant' | 'other';
  description: string;
  price: number;
  duration?: number; // in minutes
  available: boolean;
}

// Register Types
export type RegisterType = "hotel" | "restaurant" | "poker" | "rooftop";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "payment" | "refund" | "pending";
  method: "cash" | "card" | "transfer";
  registerType: RegisterType;
  description: string;
  staffId?: string;
  staffName?: string;
  clientId?: string;
  clientName?: string;
  category?: string;
  subcategory?: string;
}

// Dashboard Types
export interface DashboardStat {
  title: string;
  value: string | number;
  change?: number;
  icon: string | React.FC<{ className?: string }>;
  color?: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  children?: NavItem[];
}
