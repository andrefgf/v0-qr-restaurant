-- Seed Demo Data for Testing
-- Run this after the setup script to populate with sample data

-- Insert demo restaurant
INSERT INTO public.restaurants (id, name, logo_url, primary_color)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'The Gourmet Kitchen',
  '/placeholder.svg?height=80&width=80',
  '#FF6B35'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo tables
INSERT INTO public.tables (restaurant_id, table_number, qr_code, active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', '1', 'demo', true),
  ('00000000-0000-0000-0000-000000000001', '2', 'table-2', true),
  ('00000000-0000-0000-0000-000000000001', '3', 'table-3', true),
  ('00000000-0000-0000-0000-000000000001', '4', 'table-4', true),
  ('00000000-0000-0000-0000-000000000001', '5', 'table-5', true)
ON CONFLICT (qr_code) DO NOTHING;

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
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Bruschetta', 'Toasted bread topped with fresh tomatoes, basil, and mozzarella', 8.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Calamari Fritti', 'Crispy fried calamari served with marinara sauce', 12.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Caesar Salad', 'Romaine lettuce, parmesan, croutons, and Caesar dressing', 9.99, '/placeholder.svg?height=300&width=400', true),
  
  -- Main Courses
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 16.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Grilled Salmon', 'Atlantic salmon with roasted vegetables and lemon butter sauce', 24.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Beef Tenderloin', 'Prime beef tenderloin with mashed potatoes and red wine reduction', 32.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Pasta Carbonara', 'Spaghetti with pancetta, egg, parmesan, and black pepper', 18.99, '/placeholder.svg?height=300&width=400', true),
  
  -- Desserts
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone', 8.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 9.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Panna Cotta', 'Creamy Italian custard with berry compote', 7.99, '/placeholder.svg?height=300&width=400', true),
  
  -- Beverages
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Espresso', 'Rich Italian espresso', 3.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Cappuccino', 'Espresso with steamed milk and foam', 4.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Fresh Lemonade', 'House-made lemonade with fresh lemons', 3.99, '/placeholder.svg?height=300&width=400', true),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Red Wine', 'Glass of house red wine', 8.99, '/placeholder.svg?height=300&width=400', true)
ON CONFLICT DO NOTHING;
