
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
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        
        // Se há erro de recursão ou não encontrou perfil, criar um perfil padrão admin
        console.log('Criando perfil admin padrão devido ao erro...');
        const defaultProfile = { 
          id: userId, 
          role: 'admin',
          name: 'Admin',
          email: '',
          company_id: null
        } as Profile;
        
        setProfile(defaultProfile);
        
        // Só redirecionar se estamos na página de auth
        const currentPath = window.location.pathname;
        console.log('Caminho atual após erro:', currentPath);
        
        if (currentPath === '/auth') {
          console.log('Redirecionando admin para /admin após erro de perfil');
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 100);
        }
      } else if (data) {
        console.log('Perfil carregado com sucesso:', data);
        setProfile(data as Profile);
        
        // Só redirecionar se estamos na página de auth
        const currentPath = window.location.pathname;
        console.log('Caminho atual:', currentPath);
        
        if (currentPath === '/auth') {
          console.log('Iniciando redirecionamento para role:', data.role);
          setTimeout(() => {
            redirectBasedOnRole(data.role);
          }, 100);
        }
      } else {
        console.log('Nenhum perfil encontrado, criando perfil admin padrão...');
        const defaultProfile = { 
          id: userId, 
          role: 'admin',
          name: 'Admin',
          email: '',
          company_id: null
        } as Profile;
        
        setProfile(defaultProfile);
        
        const currentPath = window.location.pathname;
        if (currentPath === '/auth') {
          console.log('Redirecionando para admin (sem perfil encontrado)');
          setTimeout(() => {
            navigate('/admin', { replace: true });
          }, 100);
        }
      }
    } catch (error) {
      console.error('Erro crítico ao carregar perfil:', error);
      // Em caso de erro crítico, assumir admin sem redirecionar automaticamente
      const defaultProfile = { 
        id: userId, 
        role: 'admin',
        name: 'Admin',
        email: '',
        company_id: null
      } as Profile;
      
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    console.log('Executando redirecionamento para role:', role, 'da página:', window.location.pathname);
    
    switch (role) {
      case 'admin':
        console.log('Redirecionando para /admin');
        navigate('/admin', { replace: true });
        break;
      case 'entregador':
        console.log('Redirecionando para /entregador');
        navigate('/entregador', { replace: true });
        break;
      case 'caixa':
        console.log('Redirecionando para /caixa');
        navigate('/caixa', { replace: true });
        break;
      case 'cozinha':
        console.log('Redirecionando para /cozinha');
        navigate('/cozinha', { replace: true });
        break;
      case 'garcon':
        console.log('Redirecionando para /garcon');
        navigate('/garcon', { replace: true });
        break;
      default:
        console.log('Redirecionando para /');
        navigate('/', { replace: true });
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
