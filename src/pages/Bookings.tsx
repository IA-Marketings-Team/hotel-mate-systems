
import React, { useState, useEffect } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, PlusCircle, FileEdit, Trash2, CheckCircle, X } from "lucide-react";
import { format, differenceInDays, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookings } from "@/hooks/useBookings";
import { BookingType, BookingStatus } from "@/types/bookings";
import NewBookingDialog from "@/components/bookings/NewBookingDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog } from "@/components/bookings/ConfirmDialog";
import { useClients } from "@/hooks/useClients";
import { useResources } from "@/hooks/useResources";

const Bookings = () => {
  const { bookings, loading, error, fetchBookings, updateBookingStatus, deleteBooking } = useBookings();
  const { data: clients } = useClients();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<BookingType>("room");
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'cancel' | 'complete' | 'delete' | null>(null);
  
  // Load resources for the active tab
  const { resources } = useResources(activeTab);

  useEffect(() => {
    const type = activeTab as BookingType;
    fetchBookings(type);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as BookingType);
  };

  const getStatusClass = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return "Confirmée";
      case "completed":
        return "Terminée";
      case "canceled":
        return "Annulée";
      default:
        return status;
    }
  };

  const getBookingTypeText = (type: BookingType) => {
    switch (type) {
      case "room":
        return "Chambre";
      case "meeting":
        return "Salle de réunion";
      case "car":
        return "Voiture";
      case "terrace":
        return "Terrasse";
      case "restaurant":
        return "Restaurant";
      default:
        return type;
    }
  };

  const getDurationDisplay = (booking: any) => {
    if (booking.bookingType === 'room' || booking.bookingType === 'car') {
      const days = differenceInDays(booking.checkOut, booking.checkIn);
      return `${days} ${days > 1 ? 'jours' : 'jour'}`;
    } else {
      const hours = differenceInHours(booking.checkOut, booking.checkIn);
      return `${hours} ${hours > 1 ? 'heures' : 'heure'}`;
    }
  };

  const handleStatusChange = async (id: string, action: 'cancel' | 'complete') => {
    setSelectedBooking(id);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const handleDeleteBooking = (id: string) => {
    setSelectedBooking(id);
    setActionType('delete');
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedBooking || !actionType) return;
    
    try {
      if (actionType === 'delete') {
        await deleteBooking(selectedBooking);
      } else {
        // Make sure we're passing a valid BookingStatus value
        const newStatus: BookingStatus = actionType === 'cancel' ? 'canceled' : 'completed';
        console.log(`Setting booking ${selectedBooking} to status: ${newStatus}`);
        await updateBookingStatus(selectedBooking, newStatus);
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedBooking(null);
      setActionType(null);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    // Search term filter
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.roomId && booking.roomId.toString().includes(searchTerm)) ||
      (booking.resourceId && booking.resourceId.toString().includes(searchTerm));

    // Status filter
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const findResourceName = (resourceId: string) => {
    if (activeTab === 'room') {
      // This would need a rooms data source
      return resourceId;
    } else {
      const resource = resources.find(r => r.id === resourceId);
      return resource ? resource.name : resourceId;
    }
  };

  if (loading) {
    return <div className="p-6">Chargement des réservations...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Réservations</h1>
        <Button onClick={() => setNewBookingOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle réservation
        </Button>
      </div>

      <Tabs defaultValue="room" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="room">Chambres</TabsTrigger>
          <TabsTrigger value="meeting">Salles de réunion</TabsTrigger>
          <TabsTrigger value="car">Voitures</TabsTrigger>
          <TabsTrigger value="terrace">Terrasses</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
        </TabsList>

        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une réservation..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="confirmed">Confirmée</SelectItem>
              <SelectItem value="completed">Terminée</SelectItem>
              <SelectItem value="canceled">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-background">
            <p className="text-muted-foreground">
              Aucune réservation trouvée pour {getBookingTypeText(activeTab)}.
            </p>
          </div>
        ) : (
          <DashboardCard title={`Réservations - ${getBookingTypeText(activeTab)}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground [&_th]:py-3 [&_th]:pr-6">
                    <th>Client</th>
                    <th>Resource</th>
                    <th>Arrivée</th>
                    <th>Départ</th>
                    <th>Durée</th>
                    <th>Statut</th>
                    <th className="text-right">Montant</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => {
                    const client = booking.clientId ? clients?.find(c => c.id === booking.clientId) : null;
                    
                    return (
                      <tr key={booking.id} className="border-t border-muted [&_td]:py-3 [&_td]:pr-6">
                        <td className="font-medium">
                          {client ? client.name : booking.guestName}
                        </td>
                        <td>{findResourceName(booking.resourceId || booking.roomId || "")}</td>
                        <td>{format(booking.checkIn, "dd MMM yyyy", { locale: fr })}</td>
                        <td>{format(booking.checkOut, "dd MMM yyyy", { locale: fr })}</td>
                        <td>{getDurationDisplay(booking)}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {getStatusText(booking.status)}
                          </span>
                        </td>
                        <td className="text-right font-medium">{booking.amount} €</td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === 'confirmed' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-green-600"
                                  onClick={() => handleStatusChange(booking.id, 'complete')}
                                  title="Marquer comme terminée"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-600"
                                  onClick={() => handleStatusChange(booking.id, 'cancel')}
                                  title="Annuler"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDeleteBooking(booking.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        )}
      </Tabs>

      <NewBookingDialog
        open={newBookingOpen}
        onOpenChange={setNewBookingOpen}
        bookingType={activeTab}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmAction}
        title={
          actionType === 'delete' 
            ? "Supprimer la réservation" 
            : actionType === 'cancel'
              ? "Annuler la réservation"
              : "Marquer comme terminée"
        }
        description={
          actionType === 'delete'
            ? "Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée."
            : actionType === 'cancel'
              ? "Êtes-vous sûr de vouloir annuler cette réservation ?"
              : "Êtes-vous sûr de vouloir marquer cette réservation comme terminée ?"
        }
      />
    </div>
  );
};

export default Bookings;
