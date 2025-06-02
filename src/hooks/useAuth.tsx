
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'caixa' | 'entregador' | 'cozinha' | 'garcon';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = (): UserRole | null => {
    return user?.user_metadata?.role || null;
  };

  const getCompanyId = (): string | null => {
    return user?.user_metadata?.company_id || null;
  };

  const isAdmin = (): boolean => {
    return getUserRole() === 'admin';
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    getUserRole,
    getCompanyId,
    isAdmin,
    signOut,
  };
};
