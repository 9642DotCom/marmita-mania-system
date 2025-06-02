
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductManagement from '@/components/admin/ProductManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import AdminHeader from '@/components/admin/AdminHeader';

export type AdminSection = 'products' | 'categories' | 'orders' | 'users';

const Admin = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('orders');

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <OrderManagement />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
