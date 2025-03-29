
import React from "react";
import { Sidebar } from "./Sidebar";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto bg-background">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
