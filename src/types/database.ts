
// Tipos temporários para as novas tabelas até o Supabase atualizar os tipos automaticamente
export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  company_id: string;
  name: string;
  email: string;
  role: 'admin' | 'caixa' | 'entregador' | 'cozinha' | 'garcon';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  company_id: string;
  category_id?: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  ingredients?: string[];
  available: boolean;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Table {
  id: string;
  company_id: string;
  number: number;
  capacity: number;
  available: boolean;
  status?: 'available' | 'occupied' | 'eating' | 'waiting_payment';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  company_id: string;
  table_id?: string;
  waiter_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  status: 'pendente' | 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
  total_amount: number;
  notes?: string;
  order_type?: 'local' | 'delivery';
  created_at: string;
  updated_at: string;
  tables?: Table;
  profiles?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  company_id: string;
  restaurant_name?: string;
  restaurant_slogan?: string;
  logo_url?: string;
  site_title?: string;
  site_description?: string;
  item1_title?: string;
  item1_description?: string;
  item2_title?: string;
  item2_description?: string;
  item3_title?: string;
  item3_description?: string;
  whatsapp_phone?: string;
  city?: string;
  state?: string;
  business_hours?: string;
  created_at: string;
  updated_at: string;
}
