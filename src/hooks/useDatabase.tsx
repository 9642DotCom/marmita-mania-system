
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
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('table_id, order_type')
        .eq('id', id)
        .single();

      if (orderError) {
        console.error('Error fetching order for table update:', orderError);
        throw orderError;
      }

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

      if (orderData.order_type === 'local' && orderData.table_id) {
        if (status === 'entregue') {
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
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('table_id, order_type, status, notes, total_amount')
        .eq('id', orderId)
        .single();

      if (orderError) {
        console.error('Error fetching order for payment:', orderError);
        throw orderError;
      }

      if (orderData.status !== 'entregue') {
        throw new Error('Pedido não está pronto para pagamento');
      }

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
      password: string;
      role: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      console.log('Criando usuário no Auth e Profile:', userData.email);

      // Primeiro, criar o usuário no sistema de autenticação
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

      // Criar ou atualizar o perfil na tabela profiles
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
        // Se falhar ao criar o perfil, ainda retornamos sucesso pois o usuário foi criado no Auth
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

  // Company Settings hooks
  const useCompanySettings = () => {
    return useQuery({
      queryKey: ['company-settings', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) {
          console.log('No company_id found in profile, skipping company settings query');
          return null;
        }
        
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .eq('company_id', profile.company_id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching company settings:', error);
          throw error;
        }
        return data || null;
      },
      enabled: !!profile?.company_id,
    });
  };

  const updateCompanySettings = useAuthenticatedMutation({
    mutationFn: async (settingsData: {
      restaurant_name?: string;
      restaurant_slogan?: string;
      logo_url?: string;
      site_title?: string;
      site_description?: string;
      item1_title?: string;
      item1_description?: string;
      item2_title?: string;
      item2_description?: string;
      item3_title?: string;
      item3_description?: string;
      whatsapp_phone?: string;
      city?: string;
      state?: string;
      business_hours?: string;
    }) => {
      if (!profile?.company_id) {
        throw new Error('Erro: ID da empresa não encontrado. Tente fazer login novamente.');
      }

      const { data: existingData } = await supabase
        .from('company_settings')
        .select('id')
        .eq('company_id', profile.company_id)
        .single();

      if (existingData) {
        const { data, error } = await supabase
          .from('company_settings')
          .update(settingsData)
          .eq('company_id', profile.company_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('company_settings')
          .insert([
            {
              ...settingsData,
              company_id: profile.company_id,
            }
          ])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    queryKey: ['company-settings'],
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
    
    // Company Settings
    useCompanySettings,
    updateCompanySettings,
  };
};
