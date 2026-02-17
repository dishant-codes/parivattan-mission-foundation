
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DonationPage from "./pages/DonationPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { LiveVisitorsProvider } from "@/context/LiveVisitorsContext";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <LiveVisitorsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/parivattan-admin/login/kishor" element={<AdminLogin />} />
          <Route path="/parivattan-admin/dashboard" element={<AdminDashboard />} />
    
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LiveVisitorsProvider>
  </TooltipProvider>
); 

export default App;
