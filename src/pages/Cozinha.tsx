
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { Order } from '@/types/database';

const Cozinha = () => {
  const { signOut } = useAuth();
  const { useOrders, updateOrderStatus } = useDatabase();
  const { data: orders = [], isLoading } = useOrders();

  const handleStartOrder = (id: string) => {
    updateOrderStatus.mutate({ id, status: 'preparando' });
  };

  const handleCompleteOrder = (id: string) => {
    updateOrderStatus.mutate({ id, status: 'saiu_entrega' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="destructive">Pendente</Badge>;
      case 'preparando':
        return <Badge variant="secondary">Preparando</Badge>;
      case 'saiu_entrega':
        return <Badge variant="default">Saiu para Entrega</Badge>;
      case 'entregue':
        return <Badge variant="outline">Entregue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o: Order) => o.status === 'pendente');
  const preparingOrders = orders.filter((o: Order) => o.status === 'preparando');
  const readyOrders = orders.filter((o: Order) => o.status === 'saiu_entrega');
  const completedOrders = orders.filter((o: Order) => o.status === 'entregue');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema da Cozinha</h1>
            <p className="text-gray-600">Gerencie a preparação dos pedidos</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Preparando</p>
                  <p className="text-2xl font-bold text-gray-900">{preparingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saíram</p>
                  <p className="text-2xl font-bold text-gray-900">{readyOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entregues</p>
                  <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Pedidos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingOrders.map((order: Order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">#{order.id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">{order.customer_name || 'Cliente não informado'}</p>
                        <p className="text-xs text-gray-500">
                          Mesa: {order.tables?.number || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">R$ {order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {order.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Obs: {order.notes}</p>
                      </div>
                    )}

                    <Button 
                      onClick={() => handleStartOrder(order.id)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="sm"
                      disabled={updateOrderStatus.isPending}
                    >
                      Iniciar Preparo
                    </Button>
                  </div>
                ))}
                {pendingOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum pedido pendente</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Em Preparo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preparingOrders.map((order: Order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-orange-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">#{order.id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">{order.customer_name || 'Cliente não informado'}</p>
                        <p className="text-xs text-gray-500">
                          Mesa: {order.tables?.number || 'N/A'}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    {order.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">Obs: {order.notes}</p>
                      </div>
                    )}

                    <Button 
                      onClick={() => handleCompleteOrder(order.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                      disabled={updateOrderStatus.isPending}
                    >
                      Enviar para Entrega
                    </Button>
                  </div>
                ))}
                {preparingOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum pedido em preparo</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Saíram para Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readyOrders.map((order: Order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">#{order.id.slice(-6)}</h3>
                        <p className="text-sm text-gray-600">{order.customer_name || 'Cliente não informado'}</p>
                        <p className="text-xs text-gray-500">
                          Mesa: {order.tables?.number || 'N/A'}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>R$ {order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {readyOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum pedido saiu para entrega</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cozinha;
