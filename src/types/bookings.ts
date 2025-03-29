
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";

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
