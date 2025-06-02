import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Plus, Utensils, Trash2, Minus, LogOut } from 'lucide-react';
import { useDatabase } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

const Garcon = () => {
  const { useProducts, useTables, createOrder, createOrderItems, createTable } = useDatabase();
  const { user, signOut } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: tables = [] } = useTables();

  const [newOrder, setNewOrder] = useState({
    tableId: '',
    customers: '',
    notes: '',
    customer_name: '',
    customer_phone: '',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showAddTableForm, setShowAddTableForm] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');

  const addItemToOrder = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItem = orderItems.find(oi => oi.product_id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(oi => 
        oi.product_id === product.id 
          ? { ...oi, quantity: oi.quantity + 1 }
          : oi
      ));
    } else {
      setOrderItems([...orderItems, { 
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: Number(product.price)
      }]);
    }
    setSelectedProductId('');
  };

  const removeItemFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter(oi => oi.product_id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromOrder(productId);
      return;
    }
    setOrderItems(orderItems.map(oi => 
      oi.product_id === productId 
        ? { ...oi, quantity }
        : oi
    ));
  };

  const calculateOrderTotal = () => {
    return orderItems.reduce((total, oi) => total + (oi.unit_price * oi.quantity), 0);
  };

  const handleNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newOrder.tableId || orderItems.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione uma mesa e adicione pelo menos um item",
        variant: "destructive"
      });
      return;
    }

    try {
      // Criar pedido
      const orderData = {
        table_id: newOrder.tableId,
        customer_name: newOrder.customer_name,
        customer_phone: newOrder.customer_phone,
        total_amount: calculateOrderTotal(),
        notes: newOrder.notes,
        status: 'pendente' as const,
      };

      const order = await createOrder.mutateAsync(orderData);

      // Criar itens do pedido
      await createOrderItems.mutateAsync({
        orderId: order.id,
        items: orderItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.notes,
        }))
      });

      toast({
        title: "Pedido criado!",
        description: "Pedido enviado para a cozinha com sucesso.",
      });

      // Limpar formulário
      setNewOrder({ tableId: '', customers: '', notes: '', customer_name: '', customer_phone: '' });
      setOrderItems([]);
      setShowOrderForm(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar pedido",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTableNumber.trim()) {
      try {
        await createTable.mutateAsync({
          number: parseInt(newTableNumber.replace(/\D/g, '')) || tables.length + 1,
          capacity: 4,
        });

        toast({
          title: "Mesa adicionada!",
          description: `${newTableNumber} foi criada com sucesso.`,
        });

        setNewTableNumber('');
        setShowAddTableForm(false);
      } catch (error: any) {
        toast({
          title: "Erro ao criar mesa",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="default">Livre</Badge>;
      case 'occupied':
        return <Badge variant="secondary">Ocupada</Badge>;
      case 'waiting':
        return <Badge variant="destructive">Aguardando</Badge>;
      default:
        return <Badge variant="secondary">Livre</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-green-300 bg-green-50';
      case 'occupied':
        return 'border-blue-300 bg-blue-50';
      case 'waiting':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const availableTables = tables.filter(t => t.available);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema do Garçom</h1>
            <p className="text-gray-600">Olá, {user?.user_metadata?.name || user?.email}! Gerencie mesas e atendimento</p>
          </div>
          <Button 
            onClick={signOut}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Mesas</p>
                  <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mesas Disponíveis</p>
                  <p className="text-2xl font-bold text-gray-900">{availableTables.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produtos Disponíveis</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
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
                  disabled={availableTables.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pedido
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Button 
                  onClick={() => setShowAddTableForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Mesa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mesas da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tables.map((table) => (
                <div key={table.id} className={`border-2 rounded-lg p-4 relative ${getStatusColor('available')}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">Mesa {table.number}</h3>
                    <div className="flex gap-2">
                      {getStatusBadge('available')}
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">Capacidade: {table.capacity} pessoas</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewOrder(prev => ({ ...prev, tableId: table.id }));
                        setShowOrderForm(true);
                      }}
                    >
                      Fazer Pedido
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal para novo pedido */}
        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Novo Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="table">Mesa</Label>
                    <Select value={newOrder.tableId} onValueChange={(value) => setNewOrder(prev => ({ ...prev, tableId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma mesa" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTables.map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            Mesa {table.number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="customerName">Nome do Cliente</Label>
                    <Input
                      id="customerName"
                      value={newOrder.customer_name}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Telefone do Cliente</Label>
                    <Input
                      id="customerPhone"
                      value={newOrder.customer_phone}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label>Adicionar Item</Label>
                    <div className="flex gap-2">
                      <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - R$ {Number(product.price).toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={addItemToOrder} disabled={!selectedProductId}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {orderItems.length > 0 && (
                    <div>
                      <Label>Itens do Pedido</Label>
                      <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                        {orderItems.map((orderItem) => (
                          <div key={orderItem.product_id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex-1">
                              <p className="font-medium">{orderItem.product_name}</p>
                              <p className="text-sm text-gray-600">R$ {orderItem.unit_price.toFixed(2)} cada</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(orderItem.product_id, orderItem.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{orderItem.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateItemQuantity(orderItem.product_id, orderItem.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItemFromOrder(orderItem.product_id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-lg">R$ {calculateOrderTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}

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
                    <Button type="submit" className="flex-1" disabled={orderItems.length === 0}>
                      Enviar para Cozinha
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowOrderForm(false);
                        setNewOrder({ tableId: '', customers: '', notes: '', customer_name: '', customer_phone: '' });
                        setOrderItems([]);
                      }} 
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

        {/* Modal para adicionar mesa */}
        {showAddTableForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Adicionar Nova Mesa</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTable} className="space-y-4">
                  <div>
                    <Label htmlFor="tableNumber">Número da Mesa</Label>
                    <Input
                      id="tableNumber"
                      value={newTableNumber}
                      onChange={(e) => setNewTableNumber(e.target.value)}
                      placeholder="Ex: 10"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Adicionar
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddTableForm(false);
                        setNewTableNumber('');
                      }} 
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
