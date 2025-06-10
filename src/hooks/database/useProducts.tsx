
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
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      // Converter dados da base para o formato esperado
      const normalizedProducts = (data || []).map(product => ({
        ...product,
        price: product.preco || 0,
        description: product.descricao || '',
        image_url: product.imagem || '',
        category_id: product.categoria_id || '',
      })) as Product[];
      
      return normalizedProducts;
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

      // Converter para formato da base de dados
      const dbData = {
        company_id: profile.company_id,
        name: productData.name,
        preco: productData.price,
        descricao: productData.description,
        categoria_id: productData.category_id,
        imagem: productData.image_url,
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
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['products'],
  });

  const deleteProduct = useAuthenticatedMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
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
