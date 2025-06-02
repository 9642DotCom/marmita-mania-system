
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Caixa from "./pages/Caixa";
import Entregador from "./pages/Entregador";
import Cozinha from "./pages/Cozinha";
import Garcon from "./pages/Garcon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rota de autenticação - permite usuários logados sem perfil (fluxo de cadastro) */}
            <Route path="/auth" element={!user || !profile ? <Auth /> : <Navigate to="/" replace />} />
            
            {/* Rotas protegidas - requer usuário E perfil */}
            <Route path="/" element={user && profile ? <Index /> : <Navigate to="/auth" replace />} />
            <Route path="/admin" element={user && profile ? <Admin /> : <Navigate to="/auth" replace />} />
            <Route path="/caixa" element={user && profile ? <Caixa /> : <Navigate to="/auth" replace />} />
            <Route path="/entregador" element={user && profile ? <Entregador /> : <Navigate to="/auth" replace />} />
            <Route path="/cozinha" element={user && profile ? <Cozinha /> : <Navigate to="/auth" replace />} />
            <Route path="/garcon" element={user && profile ? <Garcon /> : <Navigate to="/auth" replace />} />
            
            {/* Página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
