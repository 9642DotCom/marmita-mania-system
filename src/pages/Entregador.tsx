
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Package, CheckCircle, LogOut, Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDatabase } from '@/hooks/useDatabase';
import { Order } from '@/types/database';

const Entregador = () => {
  const { signOut } = useAuth();
  const { useOrders, updateOrderStatus } = useDatabase();
  const { data: orders = [], isLoading } = useOrders();

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
        return <Badge variant="default" className="bg-blue-500">Em Rota</Badge>;
      case 'entregue':
        return <Badge variant="outline" className="bg-green-500 text-white">Entregue</Badge>;
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

  // Filtrar APENAS pedidos de DELIVERY que saíram para entrega ou foram entregues
  const deliveryOrders = orders.filter((o: Order) => 
    o.order_type === 'delivery' && (o.status === 'saiu_entrega' || o.status === 'entregue')
  );
  
  const activeDeliveries = deliveryOrders.filter((d: Order) => d.status === 'saiu_entrega');
  const completedDeliveries = deliveryOrders.filter((d: Order) => d.status === 'entregue');

  console.log('📊 Estados dos pedidos do ENTREGADOR:');
  console.log('🏍️ Deliveries ativos (saiu_entrega):', activeDeliveries.length);
  console.log('✅ Deliveries concluídos (entregue):', completedDeliveries.length);
  console.log('📋 Todos os pedidos delivery:', deliveryOrders.map(o => ({ 
    id: o.id.slice(0, 8), 
    status: o.status, 
    type: o.order_type,
    customer: o.customer_name
  })));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema do Entregador</h1>
            <p className="text-gray-600">Gerencie suas entregas de delivery</p>
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
                <Truck className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Deliveries Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{activeDeliveries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
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
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Deliveries Ativos ({activeDeliveries.length})
              <span className="text-sm text-gray-500">- Apenas entregas para casa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDeliveries.map((delivery: Order) => (
                <div key={delivery.id} className="border-2 border-blue-300 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        Delivery #{delivery.id.slice(-6)}
                      </h3>
                      <p className="font-medium text-gray-700">{delivery.customer_name || 'Cliente não informado'}</p>
                      <p className="text-sm text-gray-600">{delivery.customer_phone}</p>
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
                      <p className="text-sm font-medium text-gray-700">Endereço de Entrega:</p>
                    </div>
                    <p className="text-sm bg-white p-3 rounded border border-gray-200">
                      {delivery.customer_address || 'Endereço não informado'}
                    </p>
                    {delivery.customer_address && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openGPS(delivery.customer_address!)}
                        className="mt-2"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Abrir no GPS
                      </Button>
                    )}
                  </div>

                  {delivery.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        <strong>Observações:</strong> {delivery.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    {getStatusBadge(delivery.status)}
                    <Button 
                      onClick={() => handleCompleteDelivery(delivery.id)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={updateOrderStatus.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Entrega
                    </Button>
                  </div>
                </div>
              ))}
              {activeDeliveries.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">Nenhum delivery ativo no momento</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Deliveries aparecerão aqui quando estiverem prontos para entrega
                  </p>
                  <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-left">
                    <p className="font-medium mb-2">Status dos deliveries existentes:</p>
                    {deliveryOrders.length === 0 ? (
                      <p>Nenhum delivery encontrado</p>
                    ) : (
                      deliveryOrders.map(order => (
                        <div key={order.id} className="mb-1">
                          #{order.id.slice(0, 8)} - {order.status} - {order.customer_name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {completedDeliveries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Deliveries Concluídos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {completedDeliveries.map((delivery: Order) => (
                  <div key={delivery.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div>
                      <span className="font-medium">#{delivery.id.slice(-6)}</span>
                      <span className="text-gray-600 ml-2">{delivery.customer_name || 'Cliente não informado'}</span>
                      <span className="text-xs text-gray-500 ml-2">({delivery.customer_address?.slice(0, 30)}...)</span>
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
