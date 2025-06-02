
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Product, Table } from '@/types/database';
import { toast } from '@/hooks/use-toast';

// Hook alternativo que funciona mesmo quando há problemas com RLS
export const useFallbackDatabase = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Produtos - usando query mais simples
  const useProducts = () => {
    return useQuery({
      queryKey: ['products-fallback', user?.id],
      queryFn: async () => {
        if (!user?.id) {
          console.log('No user found, returning empty products');
          return [];
        }
        
        try {
          const { data, error } = await supabase
            .from('products')
            .select(`
              *,
              categories (
                id,
                name
              )
            `)
            .order('name');

          if (error) {
            console.error('Error fetching products:', error);
            // Retornar lista vazia em caso de erro
            return [];
          }
          return (data || []) as Product[];
        } catch (error) {
          console.error('Critical error fetching products:', error);
          return [];
        }
      },
      enabled: !!user?.id,
    });
  };

  // Mesas - usando query mais simples
  const useTables = () => {
    return useQuery({
      queryKey: ['tables-fallback', user?.id],
      queryFn: async () => {
        if (!user?.id) {
          console.log('No user found, returning empty tables');
          return [];
        }
        
        try {
          const { data, error } = await supabase
            .from('tables')
            .select('*')
            .order('number');

          if (error) {
            console.error('Error fetching tables:', error);
            // Retornar lista vazia em caso de erro
            return [];
          }
          return (data || []) as Table[];
        } catch (error) {
          console.error('Critical error fetching tables:', error);
          return [];
        }
      },
      enabled: !!user?.id,
    });
  };

  // Criar pedido - versão simplificada
  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      if (!user?.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      console.log('Creating order with fallback method:', orderData);

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            ...orderData,
            company_id: 'default-company-id', // ID padrão
            waiter_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Pedido criado!",
        description: "Pedido enviado para a cozinha com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating order:', error);
      toast({
        title: "Erro ao criar pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Criar itens do pedido
  const createOrderItems = useMutation({
    mutationFn: async ({ orderId, items }: { orderId: string, items: any[] }) => {
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        notes: item.notes,
      }));

      const { data, error } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (error) throw error;
      return data;
    },
  });

  // Criar mesa
  const createTable = useMutation({
    mutationFn: async (tableData: any) => {
      if (!user?.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      console.log('Creating table with fallback method:', tableData);

      const { data, error } = await supabase
        .from('tables')
        .insert([
          {
            ...tableData,
            company_id: 'default-company-id', // ID padrão
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables-fallback'] });
      toast({
        title: "Mesa adicionada!",
        description: "A mesa foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating table:', error);
      toast({
        title: "Erro ao criar mesa",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    useProducts,
    useTables,
    createOrder,
    createOrderItems,
    createTable,
  };
};
