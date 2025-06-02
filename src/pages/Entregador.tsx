import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Package, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Entregador = () => {
  const { signOut } = useAuth();
  const [deliveries, setDeliveries] = useState([
    {
      id: '#001',
      customer: 'João Silva',
      address: 'Rua das Flores, 123 - Centro',
      gps: '-23.5505, -46.6333',
      phone: '(11) 99999-9999',
      total: 25.90,
      status: 'pronto',
      estimatedTime: '20 min'
    },
    {
      id: '#002',
      customer: 'Maria Santos',
      address: 'Av. Paulista, 456 - Bela Vista',
      gps: '-23.5629, -46.6544',
      phone: '(11) 88888-8888',
      total: 18.50,
      status: 'entregando',
      estimatedTime: '15 min'
    }
  ]);

  const handleStartDelivery = (id: string) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === id ? { ...delivery, status: 'entregando' } : delivery
    ));
  };

  const handleCompleteDelivery = (id: string) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === id ? { ...delivery, status: 'entregue' } : delivery
    ));
  };

  const openGPS = (gps: string) => {
    const [lat, lng] = gps.split(', ');
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pronto':
        return <Badge variant="default">Pronto para Entrega</Badge>;
      case 'entregando':
        return <Badge variant="secondary">Em Entrega</Badge>;
      case 'entregue':
        return <Badge variant="outline">Entregue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeDeliveries = deliveries.filter(d => d.status !== 'entregue');
  const completedDeliveries = deliveries.filter(d => d.status === 'entregue');

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
                  <p className="text-sm font-medium text-gray-600">Entregas Pendentes</p>
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
                  <p className="text-2xl font-bold text-gray-900">18 min</p>
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
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{delivery.id}</h3>
                      <p className="text-gray-600">{delivery.customer}</p>
                      <p className="text-sm text-gray-500">{delivery.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">R$ {delivery.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{delivery.estimatedTime}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <p className="text-sm">{delivery.address}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openGPS(delivery.gps)}
                    >
                      Abrir no GPS
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    {getStatusBadge(delivery.status)}
                    <div className="flex gap-2">
                      {delivery.status === 'pronto' && (
                        <Button 
                          onClick={() => handleStartDelivery(delivery.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Iniciar Entrega
                        </Button>
                      )}
                      {delivery.status === 'entregando' && (
                        <Button 
                          onClick={() => handleCompleteDelivery(delivery.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Confirmar Entrega
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                {completedDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div>
                      <span className="font-medium">{delivery.id}</span>
                      <span className="text-gray-600 ml-2">{delivery.customer}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-600 font-medium">R$ {delivery.total.toFixed(2)}</span>
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
