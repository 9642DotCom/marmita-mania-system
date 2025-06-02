import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, DollarSign, Clock, CheckCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Caixa = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { signOut } = useAuth();
  
  const orders = [
    {
      id: '#001',
      customer: 'João Silva',
      total: 25.90,
      status: 'pendente',
      time: '14:30',
      items: ['Marmita Executiva', 'Refrigerante']
    },
    {
      id: '#002',
      customer: 'Maria Santos',
      total: 18.50,
      status: 'pago',
      time: '14:25',
      items: ['Marmita Fitness']
    }
  ];

  const handlePayment = (orderId: string) => {
    console.log(`Processando pagamento do pedido ${orderId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="destructive">Pendente</Badge>;
      case 'pago':
        return <Badge variant="default">Pago</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <p className="text-2xl font-bold text-gray-900">R$ 247,80</p>
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
                  <p className="text-2xl font-bold text-gray-900">3</p>
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
                  <p className="text-2xl font-bold text-gray-900">15</p>
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
                  placeholder="Buscar pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">R$ {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.time}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Itens:</p>
                    <p className="text-sm">{order.items.join(', ')}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    {getStatusBadge(order.status)}
                    {order.status === 'pendente' && (
                      <Button 
                        onClick={() => handlePayment(order.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Processar Pagamento
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Caixa;
