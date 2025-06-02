import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useAuthenticatedMutation } from './useAuthenticatedMutation';
import { Product, Table, Order, Category } from '@/types/database';

export const useDatabase = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Categories hooks
  const useCategories = () => {
    return useQuery({
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
          .order('name');

        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }
        return (data || []) as Category[];
      },
      enabled: !!profile?.company_id,
    });
  };

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
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['categories'],
  });

  const deleteCategory = useAuthenticatedMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    queryKey: ['categories'],
  });

  // Products hooks
  const useProducts = () => {
    return useQuery({
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
        return (data || []) as Product[];
      },
      enabled: !!profile?.company_id,
    });
  };

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

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            ...productData,
            company_id: profile.company_id,
          }
        ])
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

  // Tables hooks
  const useTables = () => {
    return useQuery({
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
  };

  // Orders hooks
  const useOrders = () => {
    return useQuery({
      queryKey: ['orders', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) {
          console.log('No company_id found in profile, skipping orders query');
          return [];
        }
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            tables (
              id,
              number,
              capacity,
              available,
              status,
              company_id,
              created_at,
              updated_at
            )
          `)
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
          throw error;
        }
        return (data || []) as Order[];
      },
      enabled: !!profile?.company_id,
    });
  };

  const updateOrderStatus = useAuthenticatedMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pendente' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado' }) => {
      console.log(`Updating order ${id} to status ${status}`);
      
      // Primeiro buscar o pedido para verificar se é local e qual mesa
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('table_id, order_type')
        .eq('id', id)
        .single();

      if (orderError) {
        console.error('Error fetching order for table update:', orderError);
        throw orderError;
      }

      // Atualizar o status do pedido PRIMEIRO
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }

      // DEPOIS atualizar o status da mesa baseado no status do pedido
      if (orderData.order_type === 'local' && orderData.table_id) {
        if (status === 'entregue') {
          // Quando garçom entrega na mesa, a mesa continua ocupada (cliente comendo)
          const { error: tableError } = await supabase
            .from('tables')
            .update({ status: 'occupied' })
            .eq('id', orderData.table_id);

          if (tableError) {
            console.error('Error keeping table occupied:', tableError);
            throw tableError;
          }
          console.log(`Mesa ${orderData.table_id} continua ocupada - cliente comendo`);
        } else if (status === 'cancelado') {
          // Se pedido foi cancelado, liberar a mesa
          const { error: tableError } = await supabase
            .from('tables')
            .update({ status: 'available' })
            .eq('id', orderData.table_id);

          if (tableError) {
            console.error('Error updating table status to available:', tableError);
            throw tableError;
          }
          console.log(`Mesa ${orderData.table_id} liberada após cancelamento`);
        }
      }
      
      console.log(`Order ${id} updated to ${status}`);
      return data;
    },
    queryKey: ['orders', 'tables'],
  });

  // Nova função para processar pagamento no caixa
  const processPayment = useAuthenticatedMutation({
    mutationFn: async ({ orderId, paymentMethod }: { orderId: string; paymentMethod?: string }) => {
      console.log(`Processing payment for order ${orderId} via ${paymentMethod || 'não especificado'}`);
      
      // Primeiro buscar o pedido para verificar se é local e qual mesa
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('table_id, order_type, status, notes, total_amount')
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('Error fetching order for payment:', orderError);
        throw orderError;
      }

      // Verificar se o pedido está no status correto para pagamento
      if (orderData.status !== 'entregue') {
        throw new Error('Pedido não está pronto para pagamento');
      }

      // Se for pedido local e tiver mesa, liberar a mesa após pagamento
      if (orderData.order_type === 'local' && orderData.table_id) {
        const { error: tableError } = await supabase
          .from('tables')
          .update({ status: 'available' })
          .eq('id', orderData.table_id);

        if (tableError) {
          console.error('Error updating table status after payment:', tableError);
          throw tableError;
        }
        console.log(`Mesa ${orderData.table_id} liberada após pagamento`);
      }

      // Marcar pedido como finalizado com informações de pagamento
      const paymentNote = paymentMethod ? ` [PAGO - ${paymentMethod.toUpperCase()}]` : ' [PAGO]';
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: 'entregue',
          notes: (orderData.notes || '') + paymentNote
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error processing payment:', error);
        throw error;
      }
      
      console.log(`Payment processed for order ${orderId} - R$ ${orderData.total_amount} via ${paymentMethod || 'não especificado'}`);
      return data;
    },
    queryKey: ['orders', 'tables'],
  });

  // Overload para manter compatibilidade
  const processPaymentLegacy = useAuthenticatedMutation({
    mutationFn: async (orderId: string) => {
      return processPayment.mutateAsync({ orderId });
    },
    queryKey: ['orders', 'tables'],
  });

  // User management (profiles)
  const useUsers = () => {
    return useQuery({
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
          .order('name');

        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
        return (data || []);
      },
      enabled: !!profile?.company_id,
    });
  };

  const createUser = useAuthenticatedMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      role: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      // Note: In a real implementation, you would create the auth user first
      // For now, we'll just create a profile entry
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            ...userData,
            company_id: profile.company_id,
            id: crypto.randomUUID(), // Temporary - should come from auth
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
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
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    queryKey: ['users'],
  });

  const deleteUser = useAuthenticatedMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    queryKey: ['users'],
  });

  // Create order
  const createOrder = useAuthenticatedMutation({
    mutationFn: async (orderData: any) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      console.log('Creating order with data:', orderData);
      console.log('Using company_id:', profile.company_id);
      console.log('Using waiter_id:', profile.id);

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

      if (error) {
        console.error('Error creating order:', error);
        throw error;
      }
      return data;
    },
    queryKey: ['orders'],
  });

  // Create order items
  const createOrderItems = useAuthenticatedMutation({
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
    queryKey: ['orders'],
  });

  // Create table
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
    // Categories
    useCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Products
    useProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Tables
    useTables,
    createTable,
    
    // Orders
    useOrders,
    createOrder,
    createOrderItems,
    updateOrderStatus,
    processPayment: processPaymentLegacy, // Manter compatibilidade
    
    // Users
    useUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
