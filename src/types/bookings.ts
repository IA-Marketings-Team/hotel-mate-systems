
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { Json } from "@/integrations/supabase/types";

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
  extras?: RoomExtra[];
  client?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface BookingResource {
  id: string;
  name: string;
  type: BookingType;
  capacity: number;
  pricePerNight?: number;
  pricePerHour?: number;
  features?: string[];
  status: 'available' | 'occupied' | 'maintenance';
  imageUrl?: string;
  description?: string;
}

// Helper function to validate if Json data can be safely treated as RoomExtra[] 
export function isRoomExtrasArray(data: Json | null | undefined): boolean {
  if (!data || !Array.isArray(data)) {
    return false;
  }
  
  // Check if every item in the array has the required properties for RoomExtra
  return data.every(item => 
    typeof item === 'object' && 
    item !== null &&
    'id' in item && typeof item.id === 'string' &&
    'name' in item && typeof item.name === 'string' &&
    'price' in item && typeof item.price === 'number' &&
    'quantity' in item && typeof item.quantity === 'number'
  );
}

// Helper function to safely convert Json to RoomExtra[]
export function parseRoomExtras(data: Json | null | undefined): RoomExtra[] | undefined {
  if (isRoomExtrasArray(data)) {
    // Using a more explicit type casting approach to avoid TypeScript errors
    const extrasArray = data as unknown;
    return extrasArray as RoomExtra[];
  }
  return undefined;
}
