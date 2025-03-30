
import { Room } from "@/types";

// Helper function to map database room data to our Room type
export const mapRoomData = (data: any): Room => ({
  ...data,
  pricePerNight: data.price_per_night,
  type: data.type as "standard" | "deluxe" | "suite" | "presidential",
  status: data.status === "occupied" ? "occupied" : "available",
  maintenanceStatus: data.maintenance_status === true,
  cleaningStatus: data.cleaning_status === true,
  view: data.view as "garden" | "pool" | "sea" | "mountain" | "city",
  lastCleaned: data.last_cleaned ? new Date(data.last_cleaned) : undefined,
  currentGuest: data.current_guest || undefined,
  features: data.features || [],
  notes: data.notes || ""
});
