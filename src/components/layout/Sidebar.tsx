
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Hotel, 
  BarChart, 
  Calendar, 
  UserCircle, 
  Settings, 
  CreditCard, 
  Utensils, 
  DollarSign,
  Users,
  ClipboardList
} from "lucide-react";
import { NavItem } from "@/types";

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: "BarChart",
  },
  {
    title: "Chambres",
    href: "/rooms",
    icon: "Hotel",
  },
  {
    title: "Réservations",
    href: "/bookings",
    icon: "Calendar",
  },
  {
    title: "Caisses",
    href: "/registers",
    icon: "CreditCard",
  },
  {
    title: "Services",
    href: "/services",
    icon: "ClipboardList",
  },
  {
    title: "Bar & Restaurant",
    href: "/restaurant",
    icon: "Utensils",
  },
  {
    title: "Personnel",
    href: "/staff",
    icon: "Users",
  },
  {
    title: "Finances",
    href: "/finance",
    icon: "DollarSign",
  },
  {
    title: "Paramètres",
    href: "/settings",
    icon: "Settings",
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Hotel":
      return <Hotel className="size-5" />;
    case "BarChart":
      return <BarChart className="size-5" />;
    case "Calendar":
      return <Calendar className="size-5" />;
    case "UserCircle":
      return <UserCircle className="size-5" />;
    case "Settings":
      return <Settings className="size-5" />;
    case "CreditCard":
      return <CreditCard className="size-5" />;
    case "Utensils":
      return <Utensils className="size-5" />;
    case "DollarSign":
      return <DollarSign className="size-5" />;
    case "Users":
      return <Users className="size-5" />;
    case "ClipboardList":
      return <ClipboardList className="size-5" />;
    default:
      return <div className="size-5" />;
  }
};

export function Sidebar() {
  return (
    <aside className="w-64 hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">HotelMate</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  )
                }
              >
                {getIcon(item.icon)}
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
            <UserCircle className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-sidebar-foreground/70">Connecté</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
