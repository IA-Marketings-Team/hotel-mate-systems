
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Room } from "@/types";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";
import { mapRoomData } from "@/utils/roomUtils";

export const useRoomBooking = () => {
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

  return {
    bookRoom
  };
};
