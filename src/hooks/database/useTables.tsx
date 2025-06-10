
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { Table } from '@/types/database';

export const useTables = () => {
  const { profile } = useAuth();

  const tablesQuery = useQuery({
    queryKey: ['tables', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        console.log('No company_id found in profile, skipping tables query');
        return [];
      }
      
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('company_id', profile.company_id)
        .order('number');

      if (error) {
        console.error('Error fetching tables:', error);
        throw error;
      }
      return (data || []) as Table[];
    },
    enabled: !!profile?.company_id,
  });

  const createTable = useAuthenticatedMutation({
    mutationFn: async (tableData: any) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      console.log('Creating table with data:', tableData);
      console.log('Using company_id:', profile.company_id);

      const { data, error } = await supabase
        .from('tables')
        .insert([
          {
            ...tableData,
            company_id: profile.company_id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating table:', error);
        throw error;
      }
      return data;
    },
    queryKey: ['tables'],
  });

  return {
    useTables: () => tablesQuery,
    createTable,
  };
};
