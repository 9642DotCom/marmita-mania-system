
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { Product } from '@/types/database';

export const useProducts = () => {
  const { profile } = useAuth();

  const productsQuery = useQuery({
    queryKey: ['products', profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) {
        console.log('No company_id found in profile, skipping products query');
        return [];
      }
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('company_id', profile.company_id)
        .is('deleted_at', null)
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return (data || []) as Product[];
    },
    enabled: !!profile?.company_id,
  });

  const createProduct = useAuthenticatedMutation({
    mutationFn: async (productData: {
      name: string;
      description?: string;
      price: number;
      category_id?: string;
      image_url?: string;
      ingredients?: string[];
      available?: boolean;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      const dbData = {
        company_id: profile.company_id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: productData.category_id,
        image_url: productData.image_url,
        ingredients: productData.ingredients,
        available: productData.available !== false,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['products'],
  });

  const updateProduct = useAuthenticatedMutation({
    mutationFn: async ({ id, ...productData }: {
      id: string;
      name: string;
      description?: string;
      price: number;
      category_id?: string;
      image_url?: string;
      ingredients?: string[];
      available?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['products'],
  });

  const deleteProduct = useAuthenticatedMutation({
    mutationFn: async (id: string) => {
      // Soft delete - apenas marca como deletado
      const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    queryKey: ['products'],
  });

  return {
    useProducts: () => productsQuery,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
