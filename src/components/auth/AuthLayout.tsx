
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
    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('AuthLayout - Usuário atual:', user?.id);
      setUser(user);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthLayout - Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Se o usuário fez login e está na página de auth, redirecionar
        if (event === 'SIGNED_IN' && session?.user && location.pathname === '/auth') {
          console.log('Usuário logou, redirecionando...');
          
          // Detectar role baseado no email
          const email = session.user.email || '';
          const isAdmin = email.includes('admin') || email.includes('rodrigo') || email === 'rodrigo_nunes.182@hotmail.com';
          
          setTimeout(() => {
            if (isAdmin) {
              navigate('/admin', { replace: true });
            } else {
              navigate('/garcon', { replace: true });
            }
          }, 500);
        }
      }
    );

    return () => subscription.unsubscribe();
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
