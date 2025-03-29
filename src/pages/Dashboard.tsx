
import React from "react";
import { 
  Hotel, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Tools
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  mockDashboardStats,
  mockRoomStatusCounts,
  mockRecentBookings,
  mockRevenueByService,
  mockMonthlyRevenue
} from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#3498DB', '#2C3E50', '#1ABC9C', '#F39C12', '#E74C3C'];

const Dashboard = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Hotel":
        return Hotel;
      case "Users":
        return Users;
      case "DollarSign":
        return DollarSign;
      case "Calendar":
        return Calendar;
      default:
        return Hotel;
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockDashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            stat={{
              ...stat,
              icon: getIcon(stat.icon),
            }}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="État des chambres"
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Disponibles</span>
              </div>
              <span className="font-medium">{mockRoomStatusCounts.available}</span>
            </div>
            <Progress value={(mockRoomStatusCounts.available / 46) * 100} className="h-2 bg-muted" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Occupées</span>
              </div>
              <span className="font-medium">{mockRoomStatusCounts.occupied}</span>
            </div>
            <Progress value={(mockRoomStatusCounts.occupied / 46) * 100} className="h-2 bg-muted" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Nettoyage</span>
              </div>
              <span className="font-medium">{mockRoomStatusCounts.cleaning}</span>
            </div>
            <Progress value={(mockRoomStatusCounts.cleaning / 46) * 100} className="h-2 bg-muted" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Maintenance</span>
              </div>
              <span className="font-medium">{mockRoomStatusCounts.maintenance}</span>
            </div>
            <Progress value={(mockRoomStatusCounts.maintenance / 46) * 100} className="h-2 bg-muted" />
          </div>
        </DashboardCard>

        <DashboardCard
          title="Réservations récentes"
          className="lg:col-span-2"
          action={
            <Button variant="link" size="sm" className="text-primary gap-1">
              Voir tout
              <ArrowRight className="size-4" />
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground [&_th]:py-2 [&_th]:pr-4">
                    <th>Client</th>
                    <th>Chambre</th>
                    <th>Arrivée</th>
                    <th>Départ</th>
                    <th>Statut</th>
                    <th className="text-right">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentBookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-muted [&_td]:py-2 [&_td]:pr-4">
                      <td className="font-medium">{booking.guest}</td>
                      <td>{booking.room}</td>
                      <td>{format(booking.checkIn, "dd/MM/yyyy")}</td>
                      <td>{format(booking.checkOut, "dd/MM/yyyy")}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status === "checked-in" ? "Arrivé" : "Confirmé"}
                        </span>
                      </td>
                      <td className="text-right">{booking.amount} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardCard title="Revenus par service">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRevenueByService}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockRevenueByService.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value} €`}
                  labelFormatter={(value) => mockRevenueByService[value as number].name}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Revenus mensuels">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockMonthlyRevenue}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} €`} />
                <Bar dataKey="revenue" fill="#3498DB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Dashboard;
