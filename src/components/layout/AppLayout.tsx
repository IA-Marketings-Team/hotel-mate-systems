
// Assuming this file exists. If not, create it with the necessary structure
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "./Sidebar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <div className="grid min-h-screen grid-cols-[auto_1fr]">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
};
