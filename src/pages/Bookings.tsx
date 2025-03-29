
import React, { useState } from "react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockRecentBookings } from "@/lib/mock-data";
import { Search, Calendar, PlusCircle, FileEdit, Trash2 } from "lucide-react";
import { format, subDays, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  guest: string;
  room: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  amount: number;
}

const generateMoreBookings = (): Booking[] => {
  const today = new Date();
  
  return [
    ...mockRecentBookings,
    {
      id: "5",
      guest: "Pierre Martin",
      room: "104",
      checkIn: subDays(today, 2),
      checkOut: addDays(today, 3),
      status: "checked-in",
      amount: 500,
    },
    {
      id: "6",
      guest: "Claire Dubois",
      room: "106",
      checkIn: addDays(today, 5),
      checkOut: addDays(today, 10),
      status: "confirmed",
      amount: 750,
    },
    {
      id: "7",
      guest: "François Petit",
      room: "208",
      checkIn: addDays(today, 7),
      checkOut: addDays(today, 12),
      status: "confirmed",
      amount: 930,
    },
    {
      id: "8",
      guest: "Julie Leroy",
      room: "302",
      checkIn: subDays(today, 1),
      checkOut: addDays(today, 6),
      status: "checked-in",
      amount: 1250,
    }
  ];
};

const bookings = generateMoreBookings();

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusClass = (status: string) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    // Search term filter
    const matchesSearch =
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.room.includes(searchTerm);

    // Status filter
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Réservations</h1>
        <Button>Nouvelle réservation</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="checked-in">Arrivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DashboardCard title="Réservations">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground [&_th]:py-3 [&_th]:pr-6">
                <th>Client</th>
                <th>Chambre</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Nuits</th>
                <th>Statut</th>
                <th className="text-right">Montant</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const nights = Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={booking.id} className="border-t border-muted [&_td]:py-3 [&_td]:pr-6">
                    <td className="font-medium">{booking.guest}</td>
                    <td>{booking.room}</td>
                    <td>{format(booking.checkIn, "dd MMM yyyy", { locale: fr })}</td>
                    <td>{format(booking.checkOut, "dd MMM yyyy", { locale: fr })}</td>
                    <td>{nights}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status === "checked-in" ? "Arrivé" : "Confirmé"}
                      </span>
                    </td>
                    <td className="text-right font-medium">{booking.amount} €</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
    </div>
  );
};

export default Bookings;
