
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";

export const useRoomOperations = () => {
  // Function to handle room booking with date range
  const bookRoom = async (id: string, guestName: string, clientId?: string, extras?: RoomExtra[], dateRange?: DateRange) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          status: 'occupied',
          current_guest: guestName
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom: Room = mapRoomData(data);
      
      // Create booking record
      try {
        const currentUser = "Admin"; // This would be replaced with actual user info
        
        // Get check-in and check-out dates from dateRange or default to 1 day
        const checkIn = dateRange?.from || new Date();
        const checkOut = dateRange?.to || new Date(Date.now() + 86400000);
        
        // Calculate nights
        const nights = differenceInDays(checkOut, checkIn) || 1;
        
        // Calculate total amount including extras and duration
        let totalAmount = updatedRoom.pricePerNight * nights;
        if (extras && extras.length > 0) {
          const extrasAmount = extras
            .filter(extra => extra.quantity > 0)
            .reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
          totalAmount += extrasAmount;
        }
        
        // Format extras for storage
        const extrasData = extras 
          ? extras.filter(e => e.quantity > 0).map(e => ({
              id: e.id,
              name: e.name,
              price: e.price,
              quantity: e.quantity
            }))
          : [];
        
        const { error: bookingError } = await supabase
          .from('bookings')
          .insert({
            room_id: id,
            guest_name: guestName,
            client_id: clientId || null,
            check_in: checkIn.toISOString(),
            check_out: checkOut.toISOString(),
            amount: totalAmount,
            status: 'confirmed',
            created_by: currentUser,
            booking_type: 'room',
            extras: extrasData.length > 0 ? extrasData : null,
            resource_id: id // Room is also a resource
          });
        
        if (bookingError) {
          throw bookingError;
        }
        
        toast.success(`Chambre réservée pour ${nights} nuit(s) et enregistrement créé`);
      } catch (bookingErr: any) {
        console.error("Error creating booking record:", bookingErr);
        toast.error(`Erreur lors de l'enregistrement de la réservation: ${bookingErr.message}`);
        // Still return the updated room even if booking record creation fails
      }
      
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la réservation: ${err.message}`);
      console.error("Error booking room:", err);
      throw err;
    }
  };

  // Function to make a room available
  const makeRoomAvailable = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          status: 'available',
          current_guest: null
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom = mapRoomData(data);
      
      toast.success("Chambre marquée comme disponible");
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la modification du statut: ${err.message}`);
      console.error("Error changing room status:", err);
      throw err;
    }
  };

  // Function to toggle maintenance status
  const toggleMaintenanceStatus = async (id: string, status: boolean) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          maintenance_status: status 
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom = mapRoomData(data);
      
      toast.success(status 
        ? "Chambre mise en maintenance" 
        : "Chambre retirée de maintenance");
      
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la modification de l'état de maintenance: ${err.message}`);
      console.error("Error toggling maintenance status:", err);
      throw err;
    }
  };

  // Function to toggle cleaning status
  const toggleCleaningStatus = async (id: string, status: boolean) => {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from('rooms')
        .update({ 
          cleaning_status: status,
          last_cleaned: status ? null : now.toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      const updatedRoom = mapRoomData(data);
      
      toast.success(status 
        ? "Chambre marquée à nettoyer" 
        : "Nettoyage terminé");
      
      return updatedRoom;
    } catch (err: any) {
      toast.error(`Erreur lors de la modification de l'état de nettoyage: ${err.message}`);
      console.error("Error toggling cleaning status:", err);
      throw err;
    }
  };

  // Function to set all occupied rooms to available
  const setAllOccupiedToPendingCleaning = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ status: 'available' })
        .eq('status', 'occupied')
        .select('*');

      if (error) {
        throw error;
      }

      const updatedRooms = data.map(mapRoomData);

      toast.success(`Toutes les chambres occupées sont maintenant disponibles`);
      return updatedRooms;
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour des statuts: ${err.message}`);
      console.error("Error updating room statuses:", err);
      throw err;
    }
  };

  return {
    bookRoom,
    makeRoomAvailable,
    toggleMaintenanceStatus,
    toggleCleaningStatus,
    setAllOccupiedToPendingCleaning
  };
};

// Helper function to map database room data to our Room type
const mapRoomData = (data: any): Room => ({
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
