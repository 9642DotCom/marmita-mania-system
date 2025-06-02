
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Package, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Order } from '@/types/database';

const Entregador = () => {
  const { signOut } = useAuth();
  const { useOrders, updateOrderStatus } = useDatabase();
  const { data: orders = [], isLoading } = useOrders();

  const handleStartDelivery = (id: string) => {
    updateOrderStatus.mutate({ id, status: 'saiu_entrega' });
  };

  const handleCompleteDelivery = (id: string) => {
    updateOrderStatus.mutate({ id, status: 'entregue' });
  };

  const openGPS = (address: string) => {
    if (address) {
      const encodedAddress = encodeURIComponent(address);
      window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando entregas...</p>
        </div>
      </div>
    );
  }

  // Filtrar apenas pedidos que saíram para entrega ou foram entregues
  const deliveryOrders = orders.filter((o: Order) => 
    o.status === 'saiu_entrega' || o.status === 'entregue'
  );
  
  const activeDeliveries = deliveryOrders.filter((d: Order) => d.status === 'saiu_entrega');
  const completedDeliveries = deliveryOrders.filter((d: Order) => d.status === 'entregue');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema do Entregador</h1>
            <p className="text-gray-600">Gerencie suas entregas</p>
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
                <Package className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entregas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">{activeDeliveries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entregas do Dia</p>
                  <p className="text-2xl font-bold text-gray-900">{completedDeliveries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Entregas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDeliveries.map((delivery: Order) => (
                <div key={delivery.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">#{delivery.id.slice(-6)}</h3>
                      <p className="text-gray-600">{delivery.customer_name || 'Cliente não informado'}</p>
                      <p className="text-sm text-gray-500">{delivery.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">R$ {delivery.total_amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(delivery.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">
                        {delivery.customer_address || 'Endereço não informado'}
                      </p>
                    </div>
                    {delivery.customer_address && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGPS(delivery.customer_address!)}
                      >
                        Abrir no GPS
                      </Button>
                    )}
                  </div>

                  {delivery.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Obs: {delivery.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    {getStatusBadge(delivery.status)}
                    <Button 
                      onClick={() => handleCompleteDelivery(delivery.id)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={updateOrderStatus.isPending}
                    >
                      Confirmar Entrega
                    </Button>
                  </div>
                </div>
              ))}
              {activeDeliveries.length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhuma entrega ativa no momento</p>
              )}
            </div>
          </CardContent>
        </Card>

        {completedDeliveries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Entregas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedDeliveries.map((delivery: Order) => (
                  <div key={delivery.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div>
                      <span className="font-medium">#{delivery.id.slice(-6)}</span>
                      <span className="text-gray-600 ml-2">{delivery.customer_name || 'Cliente não informado'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-600 font-medium">R$ {delivery.total_amount.toFixed(2)}</span>
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Entregador;
