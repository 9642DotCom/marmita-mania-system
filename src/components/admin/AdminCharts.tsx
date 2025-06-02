
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDatabase } from '@/hooks/useDatabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AdminCharts = () => {
  const { useOrders } = useDatabase();
  const { data: orders = [] } = useOrders();

  // Filtrar pedidos por tipo (local vs delivery)
  const ordersByType = orders.reduce((acc, order) => {
    const type = order.order_type === 'local' ? 'Mesa' : 'Delivery';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const orderTypeData = Object.entries(ordersByType).map(([type, count]) => ({
    type,
    pedidos: count,
  }));

  // Faturamento hoje
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  const todayRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= todayStart && orderDate <= todayEnd && order.status === 'entregue';
    })
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  // Faturamento últimos 15 dias
  const last15DaysData = [];
  for (let i = 14; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    const dayRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= dayStart && orderDate <= dayEnd && order.status === 'entregue';
      })
      .reduce((sum, order) => sum + Number(order.total_amount), 0);

    last15DaysData.push({
      date: format(date, 'dd/MM', { locale: ptBR }),
      faturamento: dayRevenue,
    });
  }

  // Pedidos últimos 30 dias
  const last30DaysOrdersData = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    const dayOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= dayStart && orderDate <= dayEnd;
    }).length;

    last30DaysOrdersData.push({
      date: format(date, 'dd/MM', { locale: ptBR }),
      pedidos: dayOrders,
    });
  }

  const COLORS = ['#FF8042', '#0088FE'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pedidos Mesa vs Delivery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Pedidos por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, pedidos }) => `${type}: ${pedidos}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="pedidos"
              >
                {orderTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Faturamento Hoje */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Faturamento Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              R$ {todayRevenue.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {format(today, "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Faturamento Últimos 15 Dias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Faturamento - Últimos 15 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={last15DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`R$ ${Number(value).toFixed(2)}`, 'Faturamento']}
              />
              <Line 
                type="monotone" 
                dataKey="faturamento" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pedidos Últimos 30 Dias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">
            Pedidos - Últimos 30 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={last30DaysOrdersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Pedidos']}
              />
              <Bar dataKey="pedidos" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCharts;
