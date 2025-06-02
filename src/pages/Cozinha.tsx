
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const Cozinha = () => {
  const [orders, setOrders] = useState([
    {
      id: '#001',
      customer: 'João Silva',
      items: [
        { name: 'Marmita Executiva', quantity: 1, notes: 'Sem cebola' },
        { name: 'Refrigerante', quantity: 1, notes: '' }
      ],
      status: 'preparando',
      orderTime: '14:30',
      estimatedTime: '25 min',
      priority: 'normal'
    },
    {
      id: '#002',
      customer: 'Maria Santos',
      items: [
        { name: 'Marmita Fitness', quantity: 1, notes: 'Extra salada' }
      ],
      status: 'pendente',
      orderTime: '14:35',
      estimatedTime: '20 min',
      priority: 'urgent'
    }
  ]);

  const handleStartOrder = (id: string) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: 'preparando' } : order
    ));
  };

  const handleCompleteOrder = (id: string) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: 'pronto' } : order
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="destructive">Pendente</Badge>;
      case 'preparando':
        return <Badge variant="secondary">Preparando</Badge>;
      case 'pronto':
        return <Badge variant="default">Pronto</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge variant="outline">Alta</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'pendente');
  const preparingOrders = orders.filter(o => o.status === 'preparando');
  const readyOrders = orders.filter(o => o.status === 'pronto');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema da Cozinha</h1>
          <p className="text-gray-600">Gerencie a preparação dos pedidos</p>
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
                  <p className="text-sm font-medium text-gray-600">Prontos</p>
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
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">22 min</p>
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
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.orderTime}</p>
                      </div>
                      <div className="text-right">
                        {getPriorityBadge(order.priority)}
                        <p className="text-sm text-gray-500 mt-1">{order.estimatedTime}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm mb-1">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                          {item.notes && <p className="text-gray-600 text-xs">Obs: {item.notes}</p>}
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleStartOrder(order.id)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      Iniciar Preparo
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Em Preparo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {preparingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-orange-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm mb-1">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                          {item.notes && <p className="text-gray-600 text-xs">Obs: {item.notes}</p>}
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleCompleteOrder(order.id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Marcar como Pronto
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Prontos para Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {readyOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm mb-1">
                          <span className="font-medium">{item.quantity}x {item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cozinha;
