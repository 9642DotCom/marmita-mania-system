
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
      console.log('Usuário atual detectado:', user?.id);
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
        console.log('Auth state changed:', event, session?.user?.id, 'Current path:', window.location.pathname);
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
      console.log('Carregando perfil para usuário:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        setProfile(null);
      } else {
        console.log('Perfil carregado:', data);
        setProfile(data as Profile);
        
        // Verificar se estamos na página de auth e redirecionar
        const currentPath = window.location.pathname;
        console.log('Caminho atual:', currentPath);
        
        if (data && currentPath === '/auth') {
          console.log('Iniciando redirecionamento para role:', data.role);
          // Usar um timeout maior para garantir que o estado seja atualizado
          setTimeout(() => {
            redirectBasedOnRole(data.role);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    console.log('Executando redirecionamento para role:', role, 'da página:', window.location.pathname);
    
    switch (role) {
      case 'admin':
        console.log('Redirecionando para /admin');
        navigate('/admin');
        break;
      case 'entregador':
        console.log('Redirecionando para /entregador');
        navigate('/entregador');
        break;
      case 'caixa':
        console.log('Redirecionando para /caixa');
        navigate('/caixa');
        break;
      case 'cozinha':
        console.log('Redirecionando para /cozinha');
        navigate('/cozinha');
        break;
      case 'garcon':
        console.log('Redirecionando para /garcon');
        navigate('/garcon');
        break;
      default:
        console.log('Redirecionando para /');
        navigate('/');
        break;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar o estado e redirecionar
      setUser(null);
      setProfile(null);
      navigate('/auth');
    }
  };

  return {
    user,
    profile,
    loading,
    signOut,
    redirectBasedOnRole,
  };
};
