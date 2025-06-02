
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/types/database';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadProfile(user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles' as any)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
      
      // Redirecionar baseado no role do usuário
      if (data) {
        redirectBasedOnRole(data.role);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    // Só redireciona se estiver na página de auth
    if (window.location.pathname === '/auth') {
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'entregador':
          navigate('/entregador');
          break;
        case 'caixa':
          navigate('/caixa');
          break;
        case 'cozinha':
          navigate('/cozinha');
          break;
        case 'garcon':
          navigate('/garcon');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return {
    user,
    profile,
    loading,
    signOut,
    redirectBasedOnRole,
  };
};
