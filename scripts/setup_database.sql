-- Complete Database Setup for QR Restaurant System
-- Run this script in your Supabase SQL Editor to create all tables and seed demo data

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#FF6B35',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tables table (physical restaurant tables)
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(restaurant_id, table_number)
);

-- Menu categories
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time DECIMAL(10,2) NOT NULL,
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
  stripe_payment_intent_id TEXT UNIQUE,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_tables_restaurant_id ON public.tables(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_tables_qr_code ON public.tables(qr_code);
CREATE INDEX IF NOT EXISTS idx_menu_categories_restaurant_id ON public.menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON public.orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES (Public read access for customer app)
-- ============================================

-- Restaurants: Public read
CREATE POLICY "Public can view restaurants" ON public.restaurants FOR SELECT USING (true);

-- Tables: Public read
CREATE POLICY "Public can view tables" ON public.tables FOR SELECT USING (true);

-- Menu categories: Public read
CREATE POLICY "Public can view menu categories" ON public.menu_categories FOR SELECT USING (true);

-- Menu items: Public read available items
CREATE POLICY "Public can view available menu items" ON public.menu_items FOR SELECT USING (available = true);

-- Orders: Public can insert and view their own orders
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);

-- Order items: Public can insert
CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view order items" ON public.order_items FOR SELECT USING (true);

-- Payments: Public can insert and view
CREATE POLICY "Public can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view payments" ON public.payments FOR SELECT USING (true);

-- Invoices: Public can view
CREATE POLICY "Public can view invoices" ON public.invoices FOR SELECT USING (true);

-- ============================================
-- 5. SEED DEMO DATA
-- ============================================

-- Insert demo restaurant
INSERT INTO public.restaurants (id, name, logo_url, primary_color)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'The Gourmet Kitchen',
  '/placeholder.svg?height=100&width=100',
  '#FF6B35'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo table
INSERT INTO public.tables (restaurant_id, table_number, qr_code)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '1',
  'demo'
) ON CONFLICT (qr_code) DO NOTHING;

-- Insert menu categories
INSERT INTO public.menu_categories (id, restaurant_id, name, display_order)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Appetizers', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Main Courses', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Desserts', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Beverages', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert menu items
INSERT INTO public.menu_items (restaurant_id, category_id, name, description, price, image_url, available)
VALUES 
  -- Appetizers
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Bruschetta', 'Toasted bread with fresh tomatoes, basil, and garlic', 8.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Calamari Fritti', 'Crispy fried squid with marinara sauce', 12.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Caprese Salad', 'Fresh mozzarella, tomatoes, and basil with balsamic glaze', 10.99, '/placeholder.svg?height=300&width=400', true),
  
  -- Main Courses
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Grilled Salmon', 'Atlantic salmon with lemon butter sauce and vegetables', 24.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Ribeye Steak', '12oz ribeye with garlic mashed potatoes', 32.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Chicken Parmesan', 'Breaded chicken breast with marinara and mozzarella', 18.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Vegetable Risotto', 'Creamy arborio rice with seasonal vegetables', 16.99, '/placeholder.svg?height=300&width=400', true),
  
  -- Desserts
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Chocolate Lava Cake', 'Warm chocolate cake with molten center', 9.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Panna Cotta', 'Italian cream dessert with berry compote', 7.99, '/placeholder.svg?height=300&width=400', true),
  
  -- Beverages
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Espresso', 'Rich Italian espresso', 3.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Fresh Lemonade', 'House-made lemonade', 4.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Iced Tea', 'Freshly brewed iced tea', 3.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Sparkling Water', 'San Pellegrino sparkling water', 4.99, '/placeholder.svg?height=300&width=400', true)
ON CONFLICT DO NOTHING;
