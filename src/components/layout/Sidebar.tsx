
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarRange,
  Coffee,
  Hotel,
  Server,
  FileText,
  UserCog,
  UserCheck
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Chambres", href: "/rooms", icon: Hotel },
  { name: "Réservations", href: "/bookings", icon: CalendarRange },
  { name: "Caisses", href: "/registers", icon: DollarSign },
  { name: "Factures", href: "/invoices", icon: FileText },
  { name: "Services", href: "/services", icon: Coffee },
  { name: "Personnel", href: "/staff", icon: UserCog },
  { name: "Recrutement", href: "/recruitment", icon: UserCheck },
  { name: "Blueprint", href: "/blueprint", icon: Server }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="pb-12 min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Gestion Hôtelière
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
