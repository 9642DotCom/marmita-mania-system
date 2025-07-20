
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { toast } from './use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Primeiro configurar o listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Aguardar um pouco antes de carregar o perfil para evitar deadlocks
        setTimeout(() => {
          loadUserProfile(session.user.id);
        }, 100);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
      
      setLoading(false);
    });

    // Depois verificar sessão existente
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('Sessão encontrada para usuário:', session.user.id);
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Erro no getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('Perfil não encontrado para o usuário');
          setProfile(null);
        } else {
          console.error('Erro ao carregar perfil:', profileError);
          setProfile(null);
        }
        return;
      }

      if (profileData) {
        console.log('Perfil carregado:', profileData);
        // Garantir que o role seja válido
        const validRole = ['admin', 'caixa', 'entregador', 'cozinha', 'garcon'].includes(profileData.role) 
          ? profileData.role as Profile['role']
          : 'admin' as const;
        
        setProfile({
          ...profileData,
          role: validRole
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: {
    ownerName: string;
    restaurantName: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      // Primeiro criar a empresa
      let companyId = null;
      if (metadata) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([{
            name: metadata.restaurantName,
            email: email,
            phone: metadata.phone || null,
            address: metadata.address || null
          }])
          .select()
          .single();

        if (companyError) {
          console.error('Erro ao criar empresa:', companyError);
          throw companyError;
        }

        companyId = companyData.id;
      }

      // Depois criar o usuário
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            name: metadata?.ownerName || 'Novo Usuário',
            role: 'admin',
            company_id: companyId
          }
        }
      });

      if (error) throw error;

      // Criar perfil se o usuário foi criado com sucesso
      if (data.user && companyId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            company_id: companyId,
            name: metadata?.ownerName || 'Novo Usuário',
            email: email,
            role: 'admin'
          }]);

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        toast({
          title: "Erro ao sair",
          description: "Ocorreu um erro ao fazer logout. Tente novamente.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Logout realizado com sucesso');
      setUser(null);
      setSession(null);
      setProfile(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
    }
  };

  const refreshTokenIfNeeded = async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        return false;
      }

      if (!session) {
        console.log('Sem sessão ativa');
        return false;
      }

      // Verificar se o token está próximo do vencimento (menos de 5 minutos)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = expiresAt - now;

      if (timeUntilExpiry < 300) { // Menos de 5 minutos
        console.log('Token próximo do vencimento, renovando...');
        
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          return false;
        }

        if (refreshData.session) {
          console.log('Token renovado com sucesso');
          return true;
        }
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar/renovar token:', error);
      return false;
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshTokenIfNeeded,
  };
};
