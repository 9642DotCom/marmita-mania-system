
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
import SignUp from "./pages/SignUp";
import SalesPage from "./pages/SalesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página de vendas como página inicial */}
          <Route path="/" element={<SalesPage />} />
          
          {/* Página de cadastro sem AuthLayout para ser pública */}
          <Route path="/signup" element={<SignUp />} />
          
          {/* Rotas protegidas com AuthLayout */}
          <Route path="/app" element={
            <AuthLayout>
              <Index />
            </AuthLayout>
          } />
          
          <Route 
            path="/admin" 
            element={
              <AuthLayout>
                <ProtectedRoute allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              </AuthLayout>
            } 
          />
          
          <Route 
            path="/caixa" 
            element={
              <AuthLayout>
                <ProtectedRoute allowedRoles={['admin', 'caixa']}>
                  <Caixa />
                </ProtectedRoute>
              </AuthLayout>
            } 
          />
          
          <Route 
            path="/entregador" 
            element={
              <AuthLayout>
                <ProtectedRoute allowedRoles={['admin', 'entregador']}>
                  <Entregador />
                </ProtectedRoute>
              </AuthLayout>
            } 
          />
          
          <Route 
            path="/cozinha" 
            element={
              <AuthLayout>
                <ProtectedRoute allowedRoles={['admin', 'cozinha']}>
                  <Cozinha />
                </ProtectedRoute>
              </AuthLayout>
            } 
          />
          
          <Route 
            path="/garcon" 
            element={
              <AuthLayout>
                <ProtectedRoute allowedRoles={['admin', 'garcon']}>
                  <Garcon />
                </ProtectedRoute>
              </AuthLayout>
            } 
          />
          
          <Route path="/auth" element={<RestaurantAuth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
