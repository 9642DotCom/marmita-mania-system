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

  const cleanupAuthState = () => {
    console.log('Limpando estado de autenticação...');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

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

      const expiresAt = session.expires_at || 0;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;
      
      if (timeUntilExpiry < 300) {
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

  const loadProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Erro ao obter dados do usuário:', userError);
        setLoading(false);
        return;
      }

      const userEmail = userData.user?.email || '';
      const isAdminByEmail = userEmail.includes('admin') || userEmail.includes('rodrigo') || userEmail === 'rodrigo_nunes.182@hotmail.com';
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        
        const defaultProfile = { 
          id: userId, 
          role: isAdminByEmail ? 'admin' : 'admin', // Sempre admin para novos usuários
          name: isAdminByEmail ? 'Administrador' : 'Administrador',
          email: userEmail,
          company_id: 'default-company-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile;
        
        console.log('Criando perfil padrão admin:', defaultProfile);
        setProfile(defaultProfile);
        
        try {
          await supabase
            .from('profiles')
            .insert([defaultProfile]);
          console.log('Perfil admin inserido no banco de dados com sucesso');
        } catch (insertError) {
          console.log('Erro ao inserir perfil no banco, mas continuando com perfil admin em memória:', insertError);
        }
      } else if (data) {
        console.log('Perfil carregado com sucesso:', data);
        
        const profileWithCompany = {
          ...data,
          company_id: data.company_id || 'default-company-id'
        } as Profile;
        
        setProfile(profileWithCompany);
      } else {
        console.log('Nenhum perfil encontrado, criando perfil admin...');
        
        const defaultProfile = { 
          id: userId, 
          role: 'admin', // SEMPRE admin para novos usuários
          name: 'Administrador',
          email: userEmail,
          company_id: 'default-company-id',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as Profile;
        
        setProfile(defaultProfile);
        
        try {
          await supabase
            .from('profiles')
            .insert([defaultProfile]);
          console.log('Perfil admin inserido no banco de dados com sucesso');
        } catch (insertError) {
          console.log('Erro ao inserir perfil no banco, mas continuando com perfil admin em memória:', insertError);
        }
      }

      const currentPath = window.location.pathname;
      if (currentPath === '/auth') {
        console.log('Redirecionamento necessário para admin');
        setTimeout(() => {
          redirectBasedOnRole('admin'); // Sempre redirecionar para admin
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
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('Usuário atual detectado:', user?.id);
      setUser(user);
      if (user) {
        loadProfile(user.id);
      } else {
        setLoading(false);
      }
    });

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
        console.log('Redirecionando para /admin como fallback');
        navigate('/admin', { replace: true }); // Fallback para admin
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
      console.log('Tentando criar conta e empresa...', metadata);
      cleanupAuthState();
      
      // 1. Criar usuário primeiro
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata?.ownerName,
            company_name: metadata?.restaurantName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        console.log('Usuário criado:', authData.user.id);
        
        // 2. Aguardar um pouco para garantir que o usuário foi criado
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Fazer login temporário para ter acesso autenticado
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // 4. Criar empresa (agora com usuário autenticado)
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: metadata?.restaurantName,
              email: email,
              phone: metadata?.phone,
              address: metadata?.address,
              owner_id: authData.user.id,
            }
          ])
          .select()
          .single();

        if (companyError) throw companyError;

        console.log('Empresa criada:', companyData);

        // 5. Criar perfil do usuário como admin da empresa
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              company_id: companyData.id,
              name: metadata?.ownerName,
              email: email,
              role: 'admin', // SEMPRE admin quando cria uma nova empresa
            }
          ]);

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Continua mesmo se der erro no perfil, pois o usuário e empresa foram criados
        } else {
          console.log('Perfil admin criado com sucesso');
        }

        return { data: authData, error: null };
      }
      
      return { data: authData, error: null };
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
      window.location.href = '/auth';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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
