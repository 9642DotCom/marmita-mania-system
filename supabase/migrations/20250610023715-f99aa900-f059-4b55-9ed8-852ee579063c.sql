
-- 1. IMPLEMENTAR RLS (Row Level Security) para isolar dados por empresa

-- Habilitar RLS em todas as tabelas principais
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Função para obter company_id do usuário atual (evita recursão infinita)
CREATE OR REPLACE FUNCTION public.get_current_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Políticas RLS para CATEGORIES
CREATE POLICY "Users can view company categories" ON public.categories
  FOR SELECT USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can create company categories" ON public.categories
  FOR INSERT WITH CHECK (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can update company categories" ON public.categories
  FOR UPDATE USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can delete company categories" ON public.categories
  FOR DELETE USING (company_id = public.get_current_user_company_id());

-- Políticas RLS para PRODUCTS
CREATE POLICY "Users can view company products" ON public.products
  FOR SELECT USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can create company products" ON public.products
  FOR INSERT WITH CHECK (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can update company products" ON public.products
  FOR UPDATE USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can delete company products" ON public.products
  FOR DELETE USING (company_id = public.get_current_user_company_id());

-- Políticas RLS para TABLES
CREATE POLICY "Users can view company tables" ON public.tables
  FOR SELECT USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can create company tables" ON public.tables
  FOR INSERT WITH CHECK (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can update company tables" ON public.tables
  FOR UPDATE USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can delete company tables" ON public.tables
  FOR DELETE USING (company_id = public.get_current_user_company_id());

-- Políticas RLS para ORDERS
CREATE POLICY "Users can view company orders" ON public.orders
  FOR SELECT USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can create company orders" ON public.orders
  FOR INSERT WITH CHECK (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can update company orders" ON public.orders
  FOR UPDATE USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can delete company orders" ON public.orders
  FOR DELETE USING (company_id = public.get_current_user_company_id());

-- Políticas RLS para ORDER_ITEMS (através do order)
CREATE POLICY "Users can view company order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.company_id = public.get_current_user_company_id()
    )
  );

CREATE POLICY "Users can create company order items" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.company_id = public.get_current_user_company_id()
    )
  );

CREATE POLICY "Users can update company order items" ON public.order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.company_id = public.get_current_user_company_id()
    )
  );

CREATE POLICY "Users can delete company order items" ON public.order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.company_id = public.get_current_user_company_id()
    )
  );

-- Políticas RLS para PROFILES
CREATE POLICY "Users can view company profiles" ON public.profiles
  FOR SELECT USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Apenas admins podem criar/deletar usuários (implementar depois)
CREATE POLICY "Admins can manage company profiles" ON public.profiles
  FOR ALL USING (
    company_id = public.get_current_user_company_id() AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas RLS para COMPANY_SETTINGS
CREATE POLICY "Users can view company settings" ON public.company_settings
  FOR SELECT USING (company_id = public.get_current_user_company_id());

CREATE POLICY "Admins can manage company settings" ON public.company_settings
  FOR ALL USING (
    company_id = public.get_current_user_company_id() AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. NORMALIZAR CAMPOS DA TABELA PRODUCTS
-- Remover campos duplicados e manter apenas os campos padrão
ALTER TABLE public.products DROP COLUMN IF EXISTS nome;
ALTER TABLE public.products DROP COLUMN IF EXISTS descricao;
ALTER TABLE public.products DROP COLUMN IF EXISTS preco;
ALTER TABLE public.products DROP COLUMN IF EXISTS imagem;
ALTER TABLE public.products DROP COLUMN IF EXISTS local;
ALTER TABLE public.products DROP COLUMN IF EXISTS tamanho;

-- Adicionar campos normalizados se não existirem
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);

-- Renomear categoria_id para category_id se necessário
ALTER TABLE public.products DROP COLUMN IF EXISTS categoria_id;

-- 3. ADICIONAR VALIDAÇÕES
-- Constraint para preços positivos
ALTER TABLE public.products ADD CONSTRAINT products_price_positive 
  CHECK (price >= 0);

-- Constraint para status válidos de pedidos
ALTER TABLE public.orders ADD CONSTRAINT orders_valid_status 
  CHECK (status IN ('pendente', 'preparando', 'saiu_entrega', 'entregue', 'cancelado'));

-- Constraint para tipo de pedido válido
ALTER TABLE public.orders ADD CONSTRAINT orders_valid_type 
  CHECK (order_type IN ('local', 'delivery'));

-- Constraint para status válidos de mesas
ALTER TABLE public.tables ADD CONSTRAINT tables_valid_status 
  CHECK (status IN ('available', 'occupied', 'eating', 'waiting_payment'));

-- Constraint para roles válidos
ALTER TABLE public.profiles ADD CONSTRAINT profiles_valid_role 
  CHECK (role IN ('admin', 'caixa', 'garcon', 'entregador', 'cozinha'));

-- Constraint para quantidade positiva em order_items
ALTER TABLE public.order_items ADD CONSTRAINT order_items_quantity_positive 
  CHECK (quantity > 0);

-- Constraint para preços positivos em order_items
ALTER TABLE public.order_items ADD CONSTRAINT order_items_price_positive 
  CHECK (unit_price >= 0 AND subtotal >= 0);

-- 4. CRIAR ÍNDICES PARA QUERIES FREQUENTES
-- Índices para foreign keys
CREATE INDEX IF NOT EXISTS idx_products_company_id ON public.products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_company_id ON public.categories(company_id);
CREATE INDEX IF NOT EXISTS idx_tables_company_id ON public.tables(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON public.orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON public.orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON public.profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Índices compostos para queries frequentes
CREATE INDEX IF NOT EXISTS idx_orders_company_status ON public.orders(company_id, status);
CREATE INDEX IF NOT EXISTS idx_products_company_available ON public.products(company_id, available);
CREATE INDEX IF NOT EXISTS idx_tables_company_status ON public.tables(company_id, status);

-- 5. IMPLEMENTAR SOFT DELETE para registros importantes
-- Adicionar coluna deleted_at para soft delete
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Índices para soft delete
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON public.products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_categories_deleted_at ON public.categories(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_orders_deleted_at ON public.orders(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at) WHERE deleted_at IS NULL;

-- 6. MELHORAR TRIGGERS EXISTENTES
-- Trigger para soft delete em cascade
CREATE OR REPLACE FUNCTION public.soft_delete_cascade()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando uma categoria é soft deleted, marca produtos como deleted
  IF TG_TABLE_NAME = 'categories' AND NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    UPDATE public.products 
    SET deleted_at = NEW.deleted_at 
    WHERE category_id = NEW.id AND deleted_at IS NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de soft delete cascade
DROP TRIGGER IF EXISTS trigger_soft_delete_cascade ON public.categories;
CREATE TRIGGER trigger_soft_delete_cascade
  AFTER UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.soft_delete_cascade();

-- 7. FUNÇÃO PARA RESTAURAR SOFT DELETED
CREATE OR REPLACE FUNCTION public.restore_soft_deleted(
  table_name TEXT,
  record_id UUID
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET deleted_at = NULL WHERE id = $1', table_name)
  USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
