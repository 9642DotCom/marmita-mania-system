
import { BarChart3, Package, Tags, ShoppingCart, Users, Settings, Truck, CreditCard, UserCheck, ChefHat } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      action: () => onSectionChange('dashboard')
    },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: ShoppingCart,
      action: () => onSectionChange('orders')
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
      action: () => onSectionChange('products')
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: Tags,
      action: () => onSectionChange('categories')
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      action: () => onSectionChange('users')
    },
    {
      id: 'settings',
      label: 'Configurações da Empresa',
      icon: Settings,
      action: () => onSectionChange('settings')
    },
  ];

  const operationalMenuItems = [
    {
      id: 'entregador',
      label: 'Entregas',
      icon: Truck,
      action: () => navigate('/entregador')
    },
    {
      id: 'caixa',
      label: 'Caixa',
      icon: CreditCard,
      action: () => navigate('/caixa')
    },
    {
      id: 'garcon',
      label: 'Garçom',
      icon: UserCheck,
      action: () => navigate('/garcon')
    },
    {
      id: 'cozinha',
      label: 'Cozinha',
      icon: ChefHat,
      action: () => navigate('/cozinha')
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-600">Sistema de Gerenciamento</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-4 space-y-2">
          {adminMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <SidebarSeparator className="mx-4" />

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2 px-4">Telas Operacionais</h3>
          <SidebarMenu className="space-y-2">
            {operationalMenuItems.map((item) => {
              const IconComponent = item.icon;
              
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <IconComponent className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
