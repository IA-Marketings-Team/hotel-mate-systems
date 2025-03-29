
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Staff from "./pages/Staff";
import Registers from "./pages/Registers";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import Blueprint from "./pages/Blueprint";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rooms" element={
            <AppLayout>
              <Rooms />
            </AppLayout>
          } />
          <Route path="/staff" element={
            <AppLayout>
              <Staff />
            </AppLayout>
          } />
          <Route path="/registers" element={
            <AppLayout>
              <Registers />
            </AppLayout>
          } />
          <Route path="/services" element={
            <AppLayout>
              <Services />
            </AppLayout>
          } />
          <Route path="/bookings" element={
            <AppLayout>
              <Bookings />
            </AppLayout>
          } />
          <Route path="/blueprint" element={
            <AppLayout>
              <Blueprint />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
