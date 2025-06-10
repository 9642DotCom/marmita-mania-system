
import { useCategories } from './database/useCategories';
import { useProducts } from './database/useProducts';
import { useTables } from './database/useTables';
import { useOrders } from './database/useOrders';
import { useUsers } from './database/useUsers';
import { useCompanySettings } from './database/useCompanySettings';

export const useDatabase = () => {
  const categories = useCategories();
  const products = useProducts();
  const tables = useTables();
  const orders = useOrders();
  const users = useUsers();
  const companySettings = useCompanySettings();

  return {
    // Categories
    useCategories: categories.useCategories,
    createCategory: categories.createCategory,
    updateCategory: categories.updateCategory,
    deleteCategory: categories.deleteCategory,
    
    // Products
    useProducts: products.useProducts,
    createProduct: products.createProduct,
    updateProduct: products.updateProduct,
    deleteProduct: products.deleteProduct,
    
    // Tables
    useTables: tables.useTables,
    createTable: tables.createTable,
    
    // Orders
    useOrders: orders.useOrders,
    createOrder: orders.createOrder,
    createOrderItems: orders.createOrderItems,
    updateOrderStatus: orders.updateOrderStatus,
    processPayment: orders.processPayment,
    
    // Users
    useUsers: users.useUsers,
    createUser: users.createUser,
    updateUser: users.updateUser,
    deleteUser: users.deleteUser,
    
    // Company Settings
    useCompanySettings: companySettings.useCompanySettings,
    updateCompanySettings: companySettings.updateCompanySettings,
  };
};
