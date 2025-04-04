
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import BookRoom from "./pages/BookRoom";
import Staff from "./pages/Staff";
import Registers from "./pages/Registers";
import Services from "./pages/Services";
import Bookings from "./pages/Bookings";
import NewBooking from "./pages/NewBooking";
import Blueprint from "./pages/Blueprint";
import NotFound from "./pages/NotFound";
import TransactionDetails from "./pages/TransactionDetails";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import NewClient from "./pages/NewClient";
import ClientActionsPage from "./pages/ClientActionsPage";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import NewInvoice from "./pages/NewInvoice";
import NewTransaction from "./pages/NewTransaction";
import ShiftTasks from "./pages/ShiftTasks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rooms" element={
              <AppLayout>
                <Rooms />
              </AppLayout>
            } />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/book-room/:id" element={<BookRoom />} />
            <Route path="/staff" element={
              <AppLayout>
                <Staff />
              </AppLayout>
            } />
            <Route path="/shift-tasks/:shiftId" element={<ShiftTasks />} />
            <Route path="/registers" element={
              <AppLayout>
                <Registers />
              </AppLayout>
            } />
            <Route path="/transaction/:id" element={<TransactionDetails />} />
            <Route path="/transaction/new" element={<NewTransaction />} />
            <Route path="/invoices" element={
              <AppLayout>
                <Invoices />
              </AppLayout>
            } />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/invoice/new" element={<NewInvoice />} />
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
            <Route path="/bookings/new" element={<NewBooking />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/client/:id" element={<ClientDetails />} />
            <Route path="/client/:id/actions" element={<ClientActionsPage />} />
            <Route path="/client/new" element={<NewClient />} />
            <Route path="/blueprint" element={
              <AppLayout>
                <Blueprint />
              </AppLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
