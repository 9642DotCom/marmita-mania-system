
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
      
      // Tentar carregar o perfil do banco de dados
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        
        // Tentar detectar se é admin pelo email ou outros métodos
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData.user?.email || '';
        
        // Se email contém "admin" ou outros indicadores, definir como admin
        const isAdmin = userEmail.includes('admin') || userEmail.includes('rodrigo');
        
        const defaultProfile = { 
          id: userId, 
          role: isAdmin ? 'admin' : 'garcon',
          name: isAdmin ? 'Administrador' : 'Garçom',
          email: userEmail,
          company_id: 'default-company-id'
        } as Profile;
        
        console.log('Criando perfil padrão:', defaultProfile);
        setProfile(defaultProfile);
        
        // Só redirecionar se estamos na página de auth
        const currentPath = window.location.pathname;
        console.log('Caminho atual após erro:', currentPath);
        
        if (currentPath === '/auth') {
          console.log('Redirecionando para role:', defaultProfile.role);
          setTimeout(() => {
            redirectBasedOnRole(defaultProfile.role);
          }, 100);
        }
      } else if (data) {
        console.log('Perfil carregado com sucesso:', data);
        
        // Se o perfil não tem company_id, definir um padrão
        const profileWithCompany = {
          ...data,
          company_id: data.company_id || 'default-company-id'
        } as Profile;
        
        setProfile(profileWithCompany);
        
        // Só redirecionar se estamos na página de auth
        const currentPath = window.location.pathname;
        console.log('Caminho atual:', currentPath);
        
        if (currentPath === '/auth') {
          console.log('Iniciando redirecionamento para role:', profileWithCompany.role);
          setTimeout(() => {
            redirectBasedOnRole(profileWithCompany.role);
          }, 100);
        }
      } else {
        console.log('Nenhum perfil encontrado, criando perfil padrão...');
        
        // Tentar detectar se é admin pelo email
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData.user?.email || '';
        const isAdmin = userEmail.includes('admin') || userEmail.includes('rodrigo');
        
        const defaultProfile = { 
          id: userId, 
          role: isAdmin ? 'admin' : 'garcon',
          name: isAdmin ? 'Administrador' : 'Garçom',
          email: userEmail,
          company_id: 'default-company-id'
        } as Profile;
        
        setProfile(defaultProfile);
        
        const currentPath = window.location.pathname;
        if (currentPath === '/auth') {
          console.log('Redirecionando para role:', defaultProfile.role);
          setTimeout(() => {
            redirectBasedOnRole(defaultProfile.role);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Erro crítico ao carregar perfil:', error);
      
      // Em caso de erro crítico, tentar detectar admin
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email || '';
      const isAdmin = userEmail.includes('admin') || userEmail.includes('rodrigo');
      
      const defaultProfile = { 
        id: userId, 
        role: isAdmin ? 'admin' : 'garcon',
        name: isAdmin ? 'Administrador' : 'Garçom',
        email: userEmail,
        company_id: 'default-company-id'
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
