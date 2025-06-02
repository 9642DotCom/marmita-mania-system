
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useDatabase = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Buscar produtos da empresa
  const useProducts = () => {
    return useQuery({
      queryKey: ['products', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) return [];
        
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
          .eq('available', true);

        if (error) throw error;
        return data || [];
      },
      enabled: !!profile?.company_id,
    });
  };

  // Buscar mesas da empresa
  const useTables = () => {
    return useQuery({
      queryKey: ['tables', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) return [];
        
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('number');

        if (error) throw error;
        return data || [];
      },
      enabled: !!profile?.company_id,
    });
  };

  // Buscar pedidos da empresa
  const useOrders = () => {
    return useQuery({
      queryKey: ['orders', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) return [];
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            tables (
              id,
              number
            ),
            profiles (
              id,
              name
            )
          `)
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      },
      enabled: !!profile?.company_id,
    });
  };

  // Criar pedido
  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      if (!profile?.company_id) throw new Error('Company ID not found');

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            ...orderData,
            company_id: profile.company_id,
            waiter_id: profile.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
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
      if (!profile?.company_id) throw new Error('Company ID not found');

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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });

  return {
    useProducts,
    useTables,
    useOrders,
    createOrder,
    createOrderItems,
    createTable,
  };
};
