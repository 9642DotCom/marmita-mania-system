import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, Clock, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Order } from '@/types/database';
import { toast } from '@/hooks/use-toast';

const Caixa = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { signOut } = useAuth();
  const { useOrders, processPayment } = useDatabase();
  const { data: orders = [], isLoading } = useOrders();

  const handlePayment = async (orderId: string) => {
    try {
      await processPayment.mutate(
        orderId,
        {
          onSuccess: () => {
            toast({
              title: "Pagamento processado! 💰",
              description: "Pedido finalizado e mesa liberada",
            });
          },
          onError: (error) => {
            toast({
              title: "Erro ao processar pagamento",
              description: error.message,
              variant: "destructive"
            });
          }
        }
      );
    } catch (error: any) {
      toast({
        title: "Erro ao processar pagamento",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string, notes?: string) => {
    // Verificar se já foi pago
    const isPaid = notes?.includes('[PAGO]');
    
    if (isPaid) {
      return <Badge variant="default" className="bg-green-500">Pago</Badge>;
    }
    
    switch (status) {
      case 'entregue':
        return <Badge variant="destructive">Aguardando Pagamento</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  // Filtrar pedidos para pagamento (entregues e locais)
  const paymentOrders = orders.filter((order: Order) => 
    order.order_type === 'local' && order.status === 'entregue'
  );

  const pendingPayments = paymentOrders.filter((order: Order) => !order.notes?.includes('[PAGO]'));
  const completedPayments = paymentOrders.filter((order: Order) => order.notes?.includes('[PAGO]'));

  // Calcular total do dia (pedidos pagos)
  const totalDay = completedPayments.reduce((sum, order) => sum + order.total_amount, 0);

  const filteredOrders = paymentOrders.filter(order =>
    (order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.tables?.number.toString().includes(searchTerm) || '')
  );

  console.log('📊 Estados dos pedidos do CAIXA:');
  console.log('💰 Pedidos pendentes pagamento:', pendingPayments.length);
  console.log('✅ Pedidos pagos:', completedPayments.length);
  console.log('💵 Total do dia:', totalDay.toFixed(2));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema do Caixa</h1>
            <p className="text-gray-600">Gerencie pagamentos e finalize pedidos</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total do Dia</p>
                  <p className="text-2xl font-bold text-gray-900">R$ {totalDay.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pedidos Finalizados</p>
                  <p className="text-2xl font-bold text-gray-900">{completedPayments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pedidos para Pagamento</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente, mesa ou pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order: Order) => {
                const isPaid = order.notes?.includes('[PAGO]');
                
                return (
                  <div key={order.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">#{order.id.slice(-6)}</h3>
                        <p className="text-gray-600">
                          Mesa {order.tables?.number || 'N/A'}
                        </p>
                        {order.customer_name && (
                          <p className="text-sm text-gray-500">{order.customer_name}</p>
                        )}
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          Status da Mesa: Cliente comendo 🍽️
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">R$ {order.total_amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    {order.notes && !order.notes.includes('[PAGO]') && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Observações:</p>
                        <p className="text-sm">{order.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      {getStatusBadge(order.status, order.notes)}
                      {!isPaid && (
                        <Button 
                          onClick={() => handlePayment(order.id)}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={processPayment.isPending}
                        >
                          {processPayment.isPending ? 'Processando...' : 'Processar Pagamento'}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredOrders.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Nenhum pedido para pagamento</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Pedidos aparecerão aqui quando forem entregues pelo garçom
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Caixa;
