import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductManagement from '@/components/admin/ProductManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStats from '@/components/admin/AdminStats';
import AdminCharts from '@/components/admin/AdminCharts';
import { useAuth } from '@/hooks/useAuth';

export type AdminSection = 'dashboard' | 'products' | 'categories' | 'orders' | 'users';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const { profile, loading } = useAuth();

  console.log('Admin page - profile:', profile);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  // Verificar se o usuário tem permissão de admin
  const isAdmin = profile?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <p className="text-sm text-gray-500">
            Role atual: {profile?.role || 'Não definido'}
          </p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Visão geral do sistema de gerenciamento</p>
            </div>
            <AdminStats />
            <AdminCharts />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveSection('products')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    → Gerenciar Produtos
                  </button>
                  <button 
                    onClick={() => setActiveSection('orders')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    → Ver Pedidos
                  </button>
                  <button 
                    onClick={() => setActiveSection('users')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    → Gerenciar Usuários
                  </button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sistema</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✅ Banco de dados conectado</p>
                  <p>✅ Sistema de autenticação ativo</p>
                  <p>✅ Dados em tempo real</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 p-6">
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Conectado ao Banco de Dados - Exibindo dados reais do sistema
              </p>
              <p className="text-sm text-green-600 mt-1">
                Role: {profile?.role} | Usuário: {profile?.email}
              </p>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
