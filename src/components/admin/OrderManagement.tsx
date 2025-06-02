
import { useState } from 'react';
import { Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import OrderDetailsModal from './OrderDetailsModal';

const mockOrders = [
  {
    id: 1,
    customerName: 'João Silva',
    whatsapp: '(11) 99999-9999',
    address: 'Rua A, 123 - Vila Nova',
    total: 18.50,
    status: 'pendente',
    createdAt: '2024-06-02 14:30',
    items: [
      { name: 'Marmita Executiva', quantity: 1, price: 18.50 }
    ]
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    whatsapp: '(11) 88888-8888',
    address: 'Av. B, 456 - Centro',
    total: 44.00,
    status: 'preparando',
    createdAt: '2024-06-02 13:15',
    items: [
      { name: 'Marmita Fitness', quantity: 2, price: 22.00 }
    ]
  },
  {
    id: 3,
    customerName: 'Pedro Costa',
    whatsapp: '(11) 77777-7777',
    address: 'Rua C, 789 - Jardim',
    total: 35.00,
    status: 'entregue',
    createdAt: '2024-06-02 12:00',
    items: [
      { name: 'Marmita do Chefe', quantity: 1, price: 35.00 }
    ]
  }
];

const statusOptions = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'saiu_entrega', label: 'Saiu para Entrega' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelado', label: 'Cancelado' }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'preparando':
      return 'bg-blue-100 text-blue-800';
    case 'saiu_entrega':
      return 'bg-purple-100 text-purple-800';
    case 'entregue':
      return 'bg-green-100 text-green-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = statusFilter === 'todos' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pendente').length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'preparando').length}
              </div>
              <div className="text-sm text-gray-600">Preparando</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'saiu_entrega').length}
              </div>
              <div className="text-sm text-gray-600">Em Entrega</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'entregue').length}
              </div>
              <div className="text-sm text-gray-600">Entregues</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.whatsapp}</TableCell>
                  <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {statusOptions.find(s => s.value === order.status)?.label || order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs rounded border px-2 py-1"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="preparando">Preparando</option>
                        <option value="saiu_entrega">Saiu para Entrega</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default OrderManagement;
