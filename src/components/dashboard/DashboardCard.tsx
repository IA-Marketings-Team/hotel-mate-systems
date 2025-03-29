
import React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function DashboardCard({ title, children, className, action }: DashboardCardProps) {
  return (
    <div className={cn("dashboard-card", className)}>
      <div className="dashboard-card-header">
        <h3 className="text-sm font-medium">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="dashboard-card-body">{children}</div>
    </div>
  );
}
