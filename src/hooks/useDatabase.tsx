
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Product, Table, Order } from '@/types/database';

export const useDatabase = () => {
  const { getCompanyId, user } = useAuth();
  const queryClient = useQueryClient();
  const companyId = getCompanyId();

  // Buscar produtos da empresa
  const useProducts = () => {
    return useQuery({
      queryKey: ['products', companyId],
      queryFn: async () => {
        if (!companyId) return [];
        
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              id,
              name
            )
          `)
          .eq('company_id', companyId)
          .eq('available', true);

        if (error) throw error;
        return (data || []) as Product[];
      },
      enabled: !!companyId,
    });
  };

  // Buscar mesas da empresa
  const useTables = () => {
    return useQuery({
      queryKey: ['tables', companyId],
      queryFn: async () => {
        if (!companyId) return [];
        
        const { data, error } = await supabase
          .from('tables')
          .select('*')
          .eq('company_id', companyId)
          .order('number');

        if (error) throw error;
        return (data || []) as Table[];
      },
      enabled: !!companyId,
    });
  };

  // Buscar pedidos da empresa
  const useOrders = () => {
    return useQuery({
      queryKey: ['orders', companyId],
      queryFn: async () => {
        if (!companyId) return [];
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            tables (
              id,
              number
            )
          `)
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as Order[];
      },
      enabled: !!companyId,
    });
  };

  // Criar pedido
  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      if (!companyId) throw new Error('Company ID not found');

      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            ...orderData,
            company_id: companyId,
            waiter_id: user?.id,
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
      if (!companyId) throw new Error('Company ID not found');

      const { data, error } = await supabase
        .from('tables')
        .insert([
          {
            ...tableData,
            company_id: companyId,
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
