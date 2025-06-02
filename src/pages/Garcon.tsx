
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Users, Clock, Plus, Utensils, Trash2, Minus, LogOut, Truck, UtensilsCrossed } from 'lucide-react';
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
  const { profile, signOut, loading } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: tables = [], isLoading: tablesLoading } = useTables();

  const [newOrder, setNewOrder] = useState({
    tableId: '',
    customers: '',
    notes: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    order_type: 'local' as 'local' | 'delivery',
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showAddTableForm, setShowAddTableForm] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');

  // Loading state while profile is being loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // If no profile, show error message
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Erro de Autenticação</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar as informações do usuário. 
              Tente fazer logout e login novamente.
            </p>
            <Button onClick={signOut} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Sair e Tentar Novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    
    if (orderItems.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um item ao pedido",
        variant: "destructive"
      });
      return;
    }

    // Validações específicas por tipo de pedido
    if (newOrder.order_type === 'local') {
      if (!newOrder.tableId) {
        toast({
          title: "Erro",
          description: "Selecione uma mesa para pedidos locais",
          variant: "destructive"
        });
        return;
      }
    } else if (newOrder.order_type === 'delivery') {
      if (!newOrder.customer_name || !newOrder.customer_phone || !newOrder.customer_address) {
        toast({
          title: "Erro",
          description: "Para delivery, preencha nome, telefone e endereço do cliente",
          variant: "destructive"
        });
        return;
      }
    }

    if (!profile?.company_id) {
      toast({
        title: "Erro",
        description: "Erro de autenticação. Tente fazer login novamente.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🍽️ Enviando pedido...');
      console.log('👤 Garçom:', profile.name);
      console.log('🏢 Empresa:', profile.company_id);
      console.log('📋 Tipo:', newOrder.order_type);
      console.log('📋 Dados do pedido:', newOrder);
      console.log('🛒 Itens:', orderItems);

      // Criar pedido
      const orderData = {
        table_id: newOrder.order_type === 'local' ? newOrder.tableId : null,
        customer_name: newOrder.customer_name || 'Cliente não informado',
        customer_phone: newOrder.customer_phone || '',
        customer_address: newOrder.customer_address || '',
        total_amount: calculateOrderTotal(),
        notes: newOrder.notes || '',
        status: 'pendente' as const,
        order_type: newOrder.order_type,
      };

      console.log('📝 Criando pedido com dados:', orderData);
      const order = await createOrder.mutateAsync(orderData);
      console.log('✅ Pedido criado com sucesso:', order);

      // Criar itens do pedido
      console.log('📦 Adicionando itens ao pedido...');
      await createOrderItems.mutateAsync({
        orderId: order.id,
        items: orderItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.notes || '',
        }))
      });

      console.log('🎉 Pedido criado com sucesso!');

      const deliveryInfo = newOrder.order_type === 'delivery' 
        ? ' - Será enviado para o motoboy' 
        : ' - Você será responsável pela entrega';

      toast({
        title: `Pedido ${newOrder.order_type === 'delivery' ? 'de delivery' : 'local'} criado! 🍽️`,
        description: `Pedido #${order.id.slice(0, 8)} foi enviado para a cozinha. Total: R$ ${calculateOrderTotal().toFixed(2)}${deliveryInfo}`,
      });

      // Limpar formulário
      setNewOrder({ 
        tableId: '', 
        customers: '', 
        notes: '', 
        customer_name: '', 
        customer_phone: '', 
        customer_address: '',
        order_type: 'local'
      });
      setOrderItems([]);
      setShowOrderForm(false);

    } catch (error: any) {
      console.error('❌ Erro ao criar pedido:', error);
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTableNumber.trim()) {
      try {
        console.log('Adding new table with number:', newTableNumber);
        
        const tableNumber = parseInt(newTableNumber.replace(/\D/g, '')) || tables.length + 1;
        
        await createTable.mutateAsync({
          number: tableNumber,
          capacity: 4,
        });

        setNewTableNumber('');
        setShowAddTableForm(false);
      } catch (error: any) {
        console.error('Error in handleAddTable:', error);
        // Error is already handled by the mutation
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Livre</Badge>;
      case 'occupied':
        return <Badge variant="default" className="bg-red-500">Ocupada</Badge>;
      case 'waiting_payment':
        return <Badge variant="secondary" className="bg-yellow-500">Aguardando Pagamento</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Livre</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-green-300 bg-green-50';
      case 'occupied':
        return 'border-red-300 bg-red-50';
      case 'waiting_payment':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-green-300 bg-green-50';
    }
  };

  const availableTables = tables.filter(t => t.status === 'available');
  const occupiedTables = tables.filter(t => t.status === 'occupied');
  const waitingPaymentTables = tables.filter(t => t.status === 'waiting_payment');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema do Garçom</h1>
            <p className="text-gray-600">Olá, {profile?.name || 'Garçom'}! Gerencie mesas e atendimento</p>
            {profile?.role === 'admin' && (
              <p className="text-sm text-green-600 font-medium">✅ Você tem acesso de administrador</p>
            )}
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

        {/* Show loading state for data */}
        {(productsLoading || tablesLoading) && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700">Carregando dados...</p>
          </div>
        )}

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
                  <p className="text-sm font-medium text-gray-600">Mesas Livres</p>
                  <p className="text-2xl font-bold text-gray-900">{availableTables.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UtensilsCrossed className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mesas Ocupadas</p>
                  <p className="text-2xl font-bold text-gray-900">{occupiedTables.length}</p>
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
                <div key={table.id} className={`border-2 rounded-lg p-4 relative ${getStatusColor(table.status || 'available')}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">Mesa {table.number}</h3>
                    <div className="flex gap-2">
                      {getStatusBadge(table.status || 'available')}
                    </div>
                  </div>
                  
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-3">Capacidade: {table.capacity} pessoas</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setNewOrder(prev => ({ ...prev, tableId: table.id, order_type: 'local' }));
                        setShowOrderForm(true);
                      }}
                      disabled={table.status === 'occupied'}
                    >
                      {table.status === 'occupied' ? 'Mesa Ocupada' : 'Fazer Pedido'}
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
                <CardTitle>Novo Pedido 🍽️</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewOrder} className="space-y-4">
                  
                  {/* Tipo de Pedido */}
                  <div>
                    <Label className="text-base font-medium">Tipo de Pedido *</Label>
                    <RadioGroup 
                      value={newOrder.order_type} 
                      onValueChange={(value: 'local' | 'delivery') => setNewOrder(prev => ({ 
                        ...prev, 
                        order_type: value,
                        tableId: value === 'delivery' ? '' : prev.tableId
                      }))}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="local" id="local" />
                        <Label htmlFor="local" className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4" />
                          Comer no Local
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery" />
                        <Label htmlFor="delivery" className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Delivery
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Mesa (apenas para pedidos locais) */}
                  {newOrder.order_type === 'local' && (
                    <div>
                      <Label htmlFor="table">Mesa *</Label>
                      <Select value={newOrder.tableId} onValueChange={(value) => setNewOrder(prev => ({ ...prev, tableId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma mesa" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTables.map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              Mesa {table.number} (até {table.capacity} pessoas)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Dados do Cliente */}
                  <div>
                    <Label htmlFor="customerName">
                      Nome do Cliente {newOrder.order_type === 'delivery' && '*'}
                    </Label>
                    <Input
                      id="customerName"
                      value={newOrder.customer_name}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_name: e.target.value }))}
                      placeholder="Nome do cliente"
                      required={newOrder.order_type === 'delivery'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">
                      Telefone do Cliente {newOrder.order_type === 'delivery' && '*'}
                    </Label>
                    <Input
                      id="customerPhone"
                      value={newOrder.customer_phone}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      required={newOrder.order_type === 'delivery'}
                    />
                  </div>

                  {/* Endereço (apenas para delivery) */}
                  {newOrder.order_type === 'delivery' && (
                    <div>
                      <Label htmlFor="customerAddress">Endereço de Entrega *</Label>
                      <Textarea
                        id="customerAddress"
                        value={newOrder.customer_address}
                        onChange={(e) => setNewOrder(prev => ({ ...prev, customer_address: e.target.value }))}
                        placeholder="Rua, número, bairro, cidade..."
                        required
                        rows={2}
                      />
                    </div>
                  )}

                  <div>
                    <Label>Adicionar Item *</Label>
                    <div className="flex gap-2">
                      <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.available).map((product) => (
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
                      <Label>Itens do Pedido ({orderItems.length})</Label>
                      <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto bg-gray-50">
                        {orderItems.map((orderItem) => (
                          <div key={orderItem.product_id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{orderItem.product_name}</p>
                              <p className="text-sm text-gray-600">R$ {orderItem.unit_price.toFixed(2)} cada</p>
                              <p className="text-sm font-semibold text-green-600">
                                Subtotal: R$ {(orderItem.unit_price * orderItem.quantity).toFixed(2)}
                              </p>
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
                              <span className="w-8 text-center font-semibold">{orderItem.quantity}</span>
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
                        <div className="flex justify-between items-center pt-3 border-t bg-green-50 p-3 rounded">
                          <span className="font-bold text-lg">Total do Pedido:</span>
                          <span className="font-bold text-xl text-green-600">R$ {calculateOrderTotal().toFixed(2)}</span>
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
                      placeholder="Observações especiais para a cozinha..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3" 
                      disabled={orderItems.length === 0}
                    >
                      {newOrder.order_type === 'delivery' ? '🏍️' : '🍽️'} 
                      {newOrder.order_type === 'delivery' ? ' Enviar para Motoboy' : ' Enviar para Cozinha'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowOrderForm(false);
                        setNewOrder({ 
                          tableId: '', 
                          customers: '', 
                          notes: '', 
                          customer_name: '', 
                          customer_phone: '', 
                          customer_address: '',
                          order_type: 'local'
                        });
                        setOrderItems([]);
                      }} 
                      className="flex-1 py-3"
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
