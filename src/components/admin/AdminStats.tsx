
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDatabase } from '@/hooks/useDatabase';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

const AdminStats = () => {
  const { useProducts, useOrders, useUsers, useCategories } = useDatabase();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();
  const { data: categories = [] } = useCategories();

  // Calculate statistics
  const totalRevenue = orders
    .filter(order => order.status === 'entregue')
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.created_at).toDateString();
    return today === orderDate;
  }).length;

  const availableProducts = products.filter(product => product.available).length;

  const stats = [
    {
      title: 'Total de Produtos',
      value: products.length,
      available: availableProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Usuários Cadastrados',
      value: users.length,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pedidos Hoje',
      value: todayOrders,
      total: orders.length,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              {stat.available !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  {stat.available} disponíveis
                </p>
              )}
              {stat.total !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  Total: {stat.total}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AdminStats;
