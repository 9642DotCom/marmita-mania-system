
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useLocation, useNavigate } from 'react-router-dom';
import RestaurantAuth from '@/pages/RestaurantAuth';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (mounted) {
          console.log('AuthLayout - Usuário atual:', user?.id);
          setUser(user);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);  
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('AuthLayout - Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN' && session?.user && location.pathname === '/auth') {
          console.log('Usuário logou, redirecionando para /app...');
          
          // Aguardar um pouco e redirecionar para /app
          setTimeout(() => {
            navigate('/app', { replace: true });
          }, 1000);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário está na rota /auth, sempre mostrar a tela de autenticação
  if (location.pathname === '/auth') {
    return <RestaurantAuth />;
  }

  // Se não está logado e não está na rota /auth, redirecionar para login
  if (!user) {
    return <RestaurantAuth />;
  }

  // Se está logado, mostrar o conteúdo
  return <>{children}</>;
};

export default AuthLayout;
