
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

export const TransactionLoading: React.FC = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <DashboardCard title="Informations générales">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Détails">
          <div className="space-y-6 p-4">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Actions">
          <div className="p-4">
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex flex-col sm:flex-row gap-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-64" />
            </div>
          </div>
        </DashboardCard>
      </div>
    </AppLayout>
  );
};
