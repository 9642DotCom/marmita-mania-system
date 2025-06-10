
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { Order } from '@/types/database';

export const useOrders = () => {
  const { profile } = useAuth();

  const ordersQuery = useQuery({
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

  return {
    useOrders: () => ordersQuery,
    createOrder,
    createOrderItems,
    updateOrderStatus,
    processPayment,
  };
};
