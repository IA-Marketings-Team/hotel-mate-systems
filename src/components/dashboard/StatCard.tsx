
import React from "react";
import { cn } from "@/lib/utils";
import { DashboardStat } from "@/types";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  stat: Omit<DashboardStat, 'icon'> & {
    icon: LucideIcon | React.FC<{ className?: string }>;
  };
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const iconClassName = cn("size-8", stat.color || "text-primary");

  // Render the icon based on type
  const renderIcon = () => {
    if (typeof stat.icon === 'string') {
      // Handle string icons (could be from a different icon system)
      return <span className={iconClassName}>{stat.icon}</span>;
    } else {
      // Handle Lucide or React component icons
      const Icon = stat.icon;
      return <Icon className={iconClassName} />;
    }
  };

  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
          <h3 className="text-2xl font-bold">{stat.value}</h3>
          {stat.change !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              {stat.change > 0 ? (
                <ArrowUp className="size-3 text-green-500" />
              ) : (
                <ArrowDown className="size-3 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  stat.change > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {Math.abs(stat.change)}% depuis le mois dernier
              </span>
            </div>
          )}
        </div>
        <div className={cn("p-2 rounded-md bg-primary/10", stat.color ? `bg-${stat.color}/10` : "")}>
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
