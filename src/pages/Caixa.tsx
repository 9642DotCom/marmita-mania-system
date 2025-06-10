
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDatabase } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';

const Caixa = () => {
  const { profile } = useAuth();
  const { useOrders, updateOrderStatus, processPayment } = useDatabase();
  const { data: orders = [], isLoading } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const handleProcessPayment = async (orderId: string, paymentMethod: string = 'dinheiro') => {
    try {
      await processPayment.mutateAsync({ orderId, paymentMethod });
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: 'pendente' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado') => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Caixa</h1>
          <p className="text-gray-600">Gerencie pagamentos e status dos pedidos</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {profile?.name || 'Usuário'} - Caixa
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
                <Badge variant={order.status === 'pendente' ? 'destructive' : 'default'}>
                  {order.status}
                </Badge>
              </div>
              <CardDescription>
                Cliente: {order.customer_name || 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ {Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    variant="outline"
                    className="flex-1"
                  >
                    Ver Detalhes
                  </Button>
                  
                  {order.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() => handleProcessPayment(order.id)}
                      className="flex-1"
                    >
                      Processar Pagamento
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Caixa;
