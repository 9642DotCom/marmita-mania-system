
import { BarChart3, Package, Tags, ShoppingCart, Users, Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: any) => void;
}

const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: ShoppingCart,
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: Package,
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: Tags,
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
    },
    {
      id: 'settings',
      label: 'Configurações da Empresa',
      icon: Settings,
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
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onSectionChange(item.id)}
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
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
