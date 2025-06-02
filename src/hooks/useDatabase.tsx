
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Product, Table, Order, Category } from '@/types/database';
import { toast } from '@/hooks/use-toast';

export const useDatabase = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  // Categories hooks
  const useCategories = () => {
    return useQuery({
      queryKey: ['categories', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) return [];
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('name');

        if (error) throw error;
        return (data || []) as Category[];
      },
      enabled: !!profile?.company_id,
    });
  };

  const createCategory = useMutation({
    mutationFn: async (categoryData: { name: string; description?: string }) => {
      if (!profile?.company_id) throw new Error('Company ID not found');

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria criada!",
        description: "A categoria foi criada com sucesso.",
      });
    },
  });

  const updateCategory = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria atualizada!",
        description: "A categoria foi atualizada com sucesso.",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria deletada!",
        description: "A categoria foi removida com sucesso.",
      });
    },
  });

  // Products hooks
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
          .order('name');

        if (error) throw error;
        return (data || []) as Product[];
      },
      enabled: !!profile?.company_id,
    });
  };

  const createProduct = useMutation({
    mutationFn: async (productData: {
      name: string;
      description?: string;
      price: number;
      category_id?: string;
      image_url?: string;
      ingredients?: string[];
      available?: boolean;
    }) => {
      if (!profile?.company_id) throw new Error('Company ID not found');

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produto criado!",
        description: "O produto foi criado com sucesso.",
      });
    },
  });

  const updateProduct = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produto atualizado!",
        description: "O produto foi atualizado com sucesso.",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produto deletado!",
        description: "O produto foi removido com sucesso.",
      });
    },
  });

  // Tables hooks
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
        if (!profile?.company_id) return [];
        
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            tables (
              id,
              number
            )
          `)
          .eq('company_id', profile.company_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []) as Order[];
      },
      enabled: !!profile?.company_id,
    });
  };

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pendente' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado' }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Status atualizado!",
        description: "O status do pedido foi atualizado com sucesso.",
      });
    },
  });

  // User management (profiles)
  const useUsers = () => {
    return useQuery({
      queryKey: ['users', profile?.company_id],
      queryFn: async () => {
        if (!profile?.company_id) return [];
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', profile.company_id)
          .order('name');

        if (error) throw error;
        return (data || []);
      },
      enabled: !!profile?.company_id,
    });
  };

  const createUser = useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      role: string;
    }) => {
      if (!profile?.company_id) throw new Error('Company ID not found');

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário criado!",
        description: "O usuário foi criado com sucesso.",
      });
    },
  });

  const updateUser = useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário atualizado!",
        description: "O usuário foi atualizado com sucesso.",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Usuário deletado!",
        description: "O usuário foi removido com sucesso.",
      });
    },
  });

  // Create order
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

  // Create order items
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

  // Create table
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
    
    // Users
    useUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
