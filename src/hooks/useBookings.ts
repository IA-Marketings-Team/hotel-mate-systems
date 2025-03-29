
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Booking, BookingType, BookingStatus } from "@/types/bookings";
import { toast } from "sonner";
import { RoomExtra } from "@/components/rooms/RoomExtrasSelector";

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (type?: BookingType, status?: BookingStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          clients (id, name, email, phone)
        `);
      
      // Apply filters if provided
      if (type) {
        query = query.eq('booking_type', type);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      // Execute query
      const { data, error } = await query.order('check_in', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const mappedBookings: Booking[] = data.map(item => {
        // Parse extras from JSON to RoomExtra[] if it exists
        let parsedExtras: RoomExtra[] | undefined = undefined;
        if (item.extras) {
          parsedExtras = Array.isArray(item.extras) ? item.extras as RoomExtra[] : undefined;
        }
        
        return {
          id: item.id,
          resourceId: item.resource_id,
          roomId: item.room_id,
          guestName: item.guest_name,
          clientId: item.client_id,
          checkIn: new Date(item.check_in),
          checkOut: new Date(item.check_out),
          amount: item.amount,
          status: item.status as BookingStatus,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          createdBy: item.created_by,
          bookingType: item.booking_type as BookingType,
          extras: parsedExtras,
          client: item.clients ? {
            id: item.clients.id,
            name: item.clients.name,
            email: item.clients.email,
            phone: item.clients.phone
          } : undefined
        };
      });
      
      setBookings(mappedBookings);
    } catch (err: any) {
      setError(err.message);
      toast.error("Erreur lors du chargement des réservations");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Convert RoomExtra[] to a JSON compatible format
      const extrasForDb = bookingData.extras ? JSON.stringify(bookingData.extras) : null;
      
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          resource_id: bookingData.resourceId,
          room_id: bookingData.roomId || null,
          guest_name: bookingData.guestName,
          client_id: bookingData.clientId || null,
          check_in: bookingData.checkIn.toISOString(),
          check_out: bookingData.checkOut.toISOString(),
          amount: bookingData.amount,
          status: bookingData.status,
          created_by: bookingData.createdBy,
          booking_type: bookingData.bookingType,
          extras: extrasForDb
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Parse extras back from JSON
      let parsedExtras: RoomExtra[] | undefined = undefined;
      if (data.extras) {
        parsedExtras = Array.isArray(data.extras) ? data.extras as RoomExtra[] : undefined;
      }

      const newBooking: Booking = {
        id: data.id,
        resourceId: data.resource_id,
        roomId: data.room_id,
        guestName: data.guest_name,
        clientId: data.client_id,
        checkIn: new Date(data.check_in),
        checkOut: new Date(data.check_out),
        amount: data.amount,
        status: data.status as BookingStatus,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        createdBy: data.created_by,
        bookingType: data.booking_type as BookingType,
        extras: parsedExtras
      };

      setBookings(prev => [newBooking, ...prev]);
      toast.success(`Réservation créée pour ${bookingData.guestName}`);
      
      return newBooking;
    } catch (err: any) {
      toast.error(`Erreur lors de la création de la réservation: ${err.message}`);
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Parse extras from JSON
      let parsedExtras: RoomExtra[] | undefined = undefined;
      if (data.extras) {
        parsedExtras = Array.isArray(data.extras) ? data.extras as RoomExtra[] : undefined;
      }

      const updatedBooking: Booking = {
        id: data.id,
        resourceId: data.resource_id,
        roomId: data.room_id,
        guestName: data.guest_name,
        clientId: data.client_id,
        checkIn: new Date(data.check_in),
        checkOut: new Date(data.check_out),
        amount: data.amount,
        status: data.status as BookingStatus,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        createdBy: data.created_by,
        bookingType: data.booking_type as BookingType,
        extras: parsedExtras
      };

      setBookings(prev => prev.map(booking => booking.id === id ? updatedBooking : booking));
      
      const statusMessages = {
        'confirmed': 'confirmée',
        'canceled': 'annulée',
        'completed': 'terminée'
      };
      
      toast.success(`Réservation ${statusMessages[status]}`);
      
      return updatedBooking;
    } catch (err: any) {
      toast.error(`Erreur lors de la mise à jour du statut: ${err.message}`);
      console.error("Error updating booking status:", err);
      throw err;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBookings(prev => prev.filter(booking => booking.id !== id));
      toast.success('Réservation supprimée');
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression: ${err.message}`);
      console.error("Error deleting booking:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBookingStatus,
    deleteBooking
  };
};
