import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Hotel, BarChart, Calendar, UserCircle, Settings, CreditCard, Utensils, DollarSign, Users, ClipboardList, User } from "lucide-react";
import { NavItem } from "@/types";
const navItems: NavItem[] = [{
  title: "Dashboard",
  href: "/",
  icon: "BarChart"
}, {
  title: "Chambres",
  href: "/rooms",
  icon: "Hotel"
}, {
  title: "Réservations",
  href: "/bookings",
  icon: "Calendar"
}, {
  title: "Caisses",
  href: "/registers",
  icon: "CreditCard"
}, {
  title: "Services",
  href: "/services",
  icon: "ClipboardList"
}, {
  title: "Bar & Restaurant",
  href: "/restaurant",
  icon: "Utensils"
}, {
  title: "Clients",
  href: "/clients",
  icon: "User"
}, {
  title: "Personnel",
  href: "/staff",
  icon: "Users"
}, {
  title: "Finances",
  href: "/finance",
  icon: "DollarSign"
}, {
  title: "Paramètres",
  href: "/settings",
  icon: "Settings"
}];
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
    case "User":
      return <User className="size-5" />;
    default:
      return <div className="size-5" />;
  }
};
export function Sidebar() {
  return <aside className="w-64 hidden md:flex flex-col bg-sidebar-gradient text-white border-r border-white/10 shrink-0">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold">Hotel de l'Avenue</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(item => <li key={item.href}>
              <NavLink to={item.href} className={({
            isActive
          }) => cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors", isActive ? "bg-white/20 text-white font-medium" : "text-white/80 hover:bg-white/10 hover:text-white")}>
                {getIcon(item.icon)}
                {item.title}
              </NavLink>
            </li>)}
        </ul>
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <UserCircle className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium">Nash</p>
            <p className="text-xs text-white/70">Connecté</p>
          </div>
        </div>
      </div>
    </aside>;
}