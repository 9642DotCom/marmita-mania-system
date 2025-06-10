
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
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
      <BrowserRouter>
        <AuthLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/caixa" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'caixa']}>
                  <Caixa />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/entregador" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'entregador']}>
                  <Entregador />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/cozinha" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'cozinha']}>
                  <Cozinha />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/garcon" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'garcon']}>
                  <Garcon />
                </ProtectedRoute>
              } 
            />
            <Route path="/auth" element={<RestaurantAuth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
