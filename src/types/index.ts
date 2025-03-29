
// Room Types
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

export interface Room {
  id: string;
  number: string;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  capacity: number;
  pricePerNight: number;
  floor: number;
  view: 'garden' | 'pool' | 'sea' | 'mountain' | 'city';
  status: RoomStatus;
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
export type RegisterType = 'hotel' | 'restaurant' | 'poker' | 'rooftop';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payment' | 'refund';
  method: 'cash' | 'card' | 'transfer';
  registerType: RegisterType;
  description: string;
  staffId?: string;
  clientId?: string;
  category?: string;
  subcategory?: string;
}

// Dashboard Types
export interface DashboardStat {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  children?: NavItem[];
}
