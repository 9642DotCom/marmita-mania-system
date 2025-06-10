
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { Category } from '@/types/database';

export const useCategories = () => {
  const { profile } = useAuth();

  const categoriesQuery = useQuery({
    queryKey: ['categories', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        console.log('No company_id found in profile, skipping categories query');
        return [];
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('company_id', profile.company_id)
        .is('deleted_at', null)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      return (data || []) as Category[];
    },
    enabled: !!profile?.company_id,
  });

  const createCategory = useAuthenticatedMutation({
    mutationFn: async (categoryData: { name: string; description?: string }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            ...categoryData,
            company_id: profile.company_id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['categories'],
  });

  const updateCategory = useAuthenticatedMutation({
    mutationFn: async ({ id, ...categoryData }: { id: string; name: string; description?: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['categories'],
  });

  const deleteCategory = useAuthenticatedMutation({
    mutationFn: async (id: string) => {
      // Soft delete - o trigger automaticamente deletará produtos relacionados
      const { error } = await supabase
        .from('categories')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    queryKey: ['categories'],
  });

  return {
    useCategories: () => categoriesQuery,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
