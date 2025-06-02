
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Caixa from "./pages/Caixa";
import Entregador from "./pages/Entregador";
import Cozinha from "./pages/Cozinha";
import Garcon from "./pages/Garcon";
import RestaurantAuth from "./pages/RestaurantAuth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthLayout>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/caixa" element={<Caixa />} />
            <Route path="/entregador" element={<Entregador />} />
            <Route path="/cozinha" element={<Cozinha />} />
            <Route path="/garcon" element={<Garcon />} />
            <Route path="/auth" element={<RestaurantAuth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthLayout>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
