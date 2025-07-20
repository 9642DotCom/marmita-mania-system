
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
    let mounted = true;

    // Configurar o listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Aguardar um pouco para carregar o perfil
          setTimeout(() => {
            if (mounted) {
              loadUserProfile(session.user.id);
            }
          }, 500);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Verificar sessão inicial
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Sessão inicial encontrada:', session.user.id);
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro na verificação inicial:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      // Usar uma query mais simples para evitar problemas de RLS
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, role, company_id, created_at, updated_at')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Erro ao carregar perfil:', profileError);
        setProfile(null);
        return;
      }

      if (profileData) {
        console.log('Perfil carregado com sucesso:', profileData);
        setProfile({
          ...profileData,
          role: profileData.role as Profile['role'],
          deleted_at: null
        });
      } else {
        console.log('Nenhum perfil encontrado para o usuário');
        setProfile(null);
      }
    } catch (error) {
      console.error('Erro inesperado ao carregar perfil:', error);
      setProfile(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }

      console.log('Login realizado com sucesso:', data.user?.id);
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no signIn:', error);
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
      console.log('Fazendo logout...');
      
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
      
      // Redirecionar para a página inicial
      window.location.href = '/';
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut
  };
};
