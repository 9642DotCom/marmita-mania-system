
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';

export const useUsers = () => {
  const { profile } = useAuth();

  const usersQuery = useQuery({
    queryKey: ['users', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        console.log('No company_id found in profile, skipping users query');
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', profile.company_id)
        .is('deleted_at', null)
        .order('name');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      return (data || []);
    },
    enabled: !!profile?.company_id,
  });

  const createUser = useAuthenticatedMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      console.log('Criando usuário no Auth e Profile:', userData.email);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            company_id: profile.company_id
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar usuário no Auth:', authError);
        throw new Error(`Erro ao criar usuário: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Usuário não foi criado no sistema de autenticação');
      }

      console.log('Usuário criado no Auth:', authData.user.id);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            company_id: profile.company_id,
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        console.log('Perfil não foi criado, mas usuário existe no Auth');
      } else {
        console.log('Perfil criado com sucesso:', profileData);
      }

      return profileData || {
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        company_id: profile.company_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    queryKey: ['users'],
  });

  const updateUser = useAuthenticatedMutation({
    mutationFn: async ({ id, ...userData }: {
      id: string;
      name: string;
      email: string;
      role: string;
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['users'],
  });

  const deleteUser = useAuthenticatedMutation({
    mutationFn: async (id: string) => {
      // Soft delete - apenas marca como deletado
      const { error } = await supabase
        .from('profiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    queryKey: ['users'],
  });

  return {
    useUsers: () => usersQuery,
    createUser,
    updateUser,
    deleteUser,
  };
};
