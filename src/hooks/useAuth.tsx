
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { toast } from './use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já existe uma sessão ativa
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Erro ao obter sessão:', error);
          return;
        }
        
        if (session?.user) {
          console.log('Sessão encontrada para usuário:', session.user.id);
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          console.log('Nenhuma sessão ativa encontrada');
          // Se não há sessão, criar perfil admin temporário para desenvolvimento
          await createDefaultProfile();
        }
      } catch (error) {
        console.error('Erro no getSession:', error);
        await createDefaultProfile();
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        await createDefaultProfile();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createDefaultProfile = async () => {
    console.log('Nenhum perfil encontrado, criando perfil admin...');
    
    try {
      // Primeiro, verificar se já existe uma empresa padrão
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .limit(1)
        .single();

      let companyId = existingCompany?.id;

      // Se não existe empresa, criar uma
      if (!companyId) {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert([{
            name: 'Empresa Padrão',
            email: 'admin@empresa.com',
            phone: '(11) 99999-9999',
            address: 'Endereço da empresa'
          }])
          .select()
          .single();

        if (companyError) {
          console.error('Erro ao criar empresa padrão:', companyError);
          return;
        }

        companyId = newCompany.id;
        console.log('Empresa padrão criada:', companyId);
      }

      // Criar perfil admin temporário
      const defaultProfile: Profile = {
        id: 'temp-admin-id',
        company_id: companyId,
        name: 'Admin Temporário',
        email: 'admin@temp.com',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setProfile(defaultProfile);
      console.log('Perfil admin inserido no banco de dados com sucesso');

    } catch (error) {
      console.error('Erro ao criar perfil padrão:', error);
      // Fallback: criar perfil básico mesmo sem empresa
      const fallbackProfile: Profile = {
        id: 'temp-admin-id',
        company_id: crypto.randomUUID(), // Gerar UUID válido
        name: 'Admin Temporário',
        email: 'admin@temp.com',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProfile(fallbackProfile);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil para usuário:', userId);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', profileError);
        await createDefaultProfile();
        return;
      }

      if (profileData) {
        console.log('Perfil carregado:', profileData);
        setProfile(profileData);
      } else {
        console.log('Perfil não encontrado, criando perfil padrão...');
        await createDefaultProfile();
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
      await createDefaultProfile();
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
        console.log('Sem sessão ativa, mantendo perfil temporário');
        return true; // Retornar true para permitir operações com perfil temporário
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
      setProfile(null);
      
      // Recriar perfil temporário após logout
      await createDefaultProfile();
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    signOut,
    refreshTokenIfNeeded,
  };
};
