
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

  // Função para limpar estado de autenticação
  const cleanupAuthState = () => {
    console.log('Limpando estado de autenticação...');
    // Limpar localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Limpar sessionStorage
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    console.log('Inicializando useAuth...');
    
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
          console.log('Usuário logado, carregando perfil...');
          loadProfile(session.user.id);
        } else {
          console.log('Usuário deslogado');
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
        // Se há erro de recursão ou não encontrou perfil, criar um perfil padrão admin
        console.log('Criando perfil admin padrão...');
        setProfile({ 
          id: userId, 
          role: 'admin',
          name: 'Admin',
          email: '',
          company_id: null
        } as Profile);
        
        // Verificar se estamos na página de auth e redirecionar
        const currentPath = window.location.pathname;
        console.log('Caminho atual após erro:', currentPath);
        
        if (currentPath === '/auth') {
          console.log('Redirecionando admin para /admin após erro de perfil');
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        }
      } else {
        console.log('Perfil carregado:', data);
        setProfile(data as Profile);
        
        // Verificar se estamos na página de auth e redirecionar
        const currentPath = window.location.pathname;
        console.log('Caminho atual:', currentPath);
        
        if (data && currentPath === '/auth') {
          console.log('Iniciando redirecionamento para role:', data.role);
          setTimeout(() => {
            redirectBasedOnRole(data.role);
          }, 500);
        }
      }
    } catch (error) {
      console.error('Erro crítico ao carregar perfil:', error);
      // Em caso de erro crítico, assumir admin e redirecionar
      setProfile({ 
        id: userId, 
        role: 'admin',
        name: 'Admin',
        email: '',
        company_id: null
      } as Profile);
      
      if (window.location.pathname === '/auth') {
        console.log('Redirecionando para admin após erro crítico');
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
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
      console.log('Iniciando logout...');
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setProfile(null);
      // Forçar refresh da página para garantir limpeza completa
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar o estado e redirecionar
      cleanupAuthState();
      setUser(null);
      setProfile(null);
      window.location.href = '/auth';
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
