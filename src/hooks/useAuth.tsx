
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

  // Função para verificar e renovar token se necessário
  const refreshTokenIfNeeded = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        if (error.message.includes('expired') || error.message.includes('JWT')) {
          console.log('Token expirado, fazendo logout...');
          await signOut();
        }
        return false;
      }
      
      if (!session) {
        console.log('Nenhuma sessão válida encontrada');
        return false;
      }

      // Verificar se o token vai expirar em menos de 5 minutos
      const expiresAt = session.expires_at || 0;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;
      
      if (timeUntilExpiry < 300) { // Menos de 5 minutos
        console.log('Token próximo do vencimento, renovando...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          await signOut();
          return false;
        }
        console.log('Token renovado com sucesso');
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar/renovar token:', error);
      return false;
    }
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

    // Configurar verificação periódica do token (a cada 10 minutos)
    const tokenCheckInterval = setInterval(refreshTokenIfNeeded, 10 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(tokenCheckInterval);
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      // Primeiro, obter informações do usuário atual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Erro ao obter dados do usuário:', userError);
        setLoading(false);
        return;
      }

      const userEmail = userData.user?.email || '';
      
      // Detectar se é admin baseado no email
      const isAdmin = userEmail.includes('admin') || userEmail.includes('rodrigo') || userEmail === 'rodrigo_nunes.182@hotmail.com';
      
      // Tentar carregar o perfil do banco de dados
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        
        // Criar perfil padrão se não existir
        const defaultProfile = { 
          id: userId, 
          role: isAdmin ? 'admin' : 'garcon',
          name: isAdmin ? 'Administrador' : 'Garçom',
          email: userEmail,
          company_id: 'default-company-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile;
        
        console.log('Criando perfil padrão:', defaultProfile);
        setProfile(defaultProfile);
        
        // Tentar inserir o perfil no banco de dados
        try {
          await supabase
            .from('profiles')
            .insert([defaultProfile]);
          console.log('Perfil inserido no banco de dados com sucesso');
        } catch (insertError) {
          console.log('Erro ao inserir perfil no banco, mas continuando com perfil em memória:', insertError);
        }
      } else if (data) {
        console.log('Perfil carregado com sucesso:', data);
        
        // Garantir que o perfil tem company_id
        const profileWithCompany = {
          ...data,
          company_id: data.company_id || 'default-company-id'
        } as Profile;
        
        setProfile(profileWithCompany);
      } else {
        console.log('Nenhum perfil encontrado, criando perfil padrão...');
        
        const defaultProfile = { 
          id: userId, 
          role: isAdmin ? 'admin' : 'garcon',
          name: isAdmin ? 'Administrador' : 'Garçom',
          email: userEmail,
          company_id: 'default-company-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile;
        
        setProfile(defaultProfile);
        
        // Tentar inserir o perfil no banco de dados
        try {
          await supabase
            .from('profiles')
            .insert([defaultProfile]);
          console.log('Perfil inserido no banco de dados com sucesso');
        } catch (insertError) {
          console.log('Erro ao inserir perfil no banco, mas continuando com perfil em memória:', insertError);
        }
      }

      // Redirecionar se estamos na página de auth
      const currentPath = window.location.pathname;
      if (currentPath === '/auth') {
        console.log('Redirecionamento necessário para role:', profile?.role || (isAdmin ? 'admin' : 'garcon'));
        setTimeout(() => {
          redirectBasedOnRole(profile?.role || (isAdmin ? 'admin' : 'garcon'));
        }, 100);
      }
    } catch (error) {
      console.error('Erro crítico ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
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

    // Configurar verificação periódica do token (a cada 10 minutos)
    const tokenCheckInterval = setInterval(refreshTokenIfNeeded, 10 * 60 * 1000);

    return () => {
      subscription.unsubscribe();
      clearInterval(tokenCheckInterval);
    };
  }, []);

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

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login...');
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data, error };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Tentando criar conta...');
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      return { data: null, error };
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
    signIn,
    signUp,
    signOut,
    redirectBasedOnRole,
    refreshTokenIfNeeded,
  };
};
