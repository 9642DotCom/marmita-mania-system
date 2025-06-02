
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Clock, Plus, Utensils } from 'lucide-react';

const Garcon = () => {
  const [tables, setTables] = useState([
    {
      id: 1,
      number: 'Mesa 01',
      customers: 2,
      status: 'ocupada',
      order: '#001',
      total: 45.80,
      startTime: '14:30'
    },
    {
      id: 2,
      number: 'Mesa 02',
      customers: 4,
      status: 'livre',
      order: '',
      total: 0,
      startTime: ''
    },
    {
      id: 3,
      number: 'Mesa 03',
      customers: 3,
      status: 'aguardando',
      order: '#002',
      total: 32.50,
      startTime: '14:45'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    table: '',
    customers: '',
    items: '',
    notes: ''
  });

  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Novo pedido:', newOrder);
    setNewOrder({ table: '', customers: '', items: '', notes: '' });
    setShowOrderForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'livre':
        return <Badge variant="default">Livre</Badge>;
      case 'ocupada':
        return <Badge variant="secondary">Ocupada</Badge>;
      case 'aguardando':
        return <Badge variant="destructive">Aguardando</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livre':
        return 'border-green-300 bg-green-50';
      case 'ocupada':
        return 'border-blue-300 bg-blue-50';
      case 'aguardando':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const occupiedTables = tables.filter(t => t.status !== 'livre').length;
  const totalCustomers = tables.reduce((sum, table) => sum + (table.status !== 'livre' ? table.customers : 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema do Garçom</h1>
          <p className="text-gray-600">Gerencie mesas e atendimento</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mesas Ocupadas</p>
                  <p className="text-2xl font-bold text-gray-900">{occupiedTables}/3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
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
                  <p className="text-2xl font-bold text-gray-900">35 min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Button 
                  onClick={() => setShowOrderForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status das Mesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tables.map((table) => (
                <div key={table.id} className={`border-2 rounded-lg p-4 ${getStatusColor(table.status)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{table.number}</h3>
                    {getStatusBadge(table.status)}
                  </div>
                  
                  {table.status !== 'livre' && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">Clientes: {table.customers}</p>
                        <p className="text-sm text-gray-600">Pedido: {table.order}</p>
                        <p className="text-sm text-gray-600">Início: {table.startTime}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600">R$ {table.total.toFixed(2)}</span>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </>
                  )}
                  
                  {table.status === 'livre' && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-3">Mesa disponível</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowOrderForm(true)}
                      >
                        Alocar Mesa
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Novo Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="table">Mesa</Label>
                    <Input
                      id="table"
                      value={newOrder.table}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, table: e.target.value }))}
                      placeholder="Ex: Mesa 01"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="customers">Número de Clientes</Label>
                    <Input
                      id="customers"
                      type="number"
                      value={newOrder.customers}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customers: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="items">Itens do Pedido</Label>
                    <Textarea
                      id="items"
                      value={newOrder.items}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, items: e.target.value }))}
                      placeholder="Ex: 2x Marmita Executiva, 1x Refrigerante"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea
                      id="notes"
                      value={newOrder.notes}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações especiais..."
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Criar Pedido
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowOrderForm(false)} 
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Garcon;
