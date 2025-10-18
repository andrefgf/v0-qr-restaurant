// app/admin/demo-setup/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function DemoSetup() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const setupDemoData = async () => {
    setLoading(true);
    
    try {
      // 1. Get or create restaurant
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let restaurantId: string;

      const { data: existingRestaurants } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1);

      if (existingRestaurants?.[0]) {
        restaurantId = existingRestaurants[0].id;
      } else {
        const { data: newRestaurant, error } = await supabase
          .from('restaurants')
          .insert([{
            name: 'Demo Restaurant',
            primary_color: '#FF6B35',
          }])
          .select()
          .single();

        if (error) throw error;
        restaurantId = newRestaurant.id;
      }

      // 2. Create menu categories
      const { data: categories, error: catError } = await supabase
        .from('menu_categories')
        .insert([
          { restaurant_id: restaurantId, name: 'Main Courses', display_order: 1 },
          { restaurant_id: restaurantId, name: 'Sides', display_order: 2 },
          { restaurant_id: restaurantId, name: 'Drinks', display_order: 3 },
        ])
        .select();

      if (catError) throw catError;

      // 3. Create menu items
      const { error: itemsError } = await supabase
        .from('menu_items')
        .insert([
          {
            restaurant_id: restaurantId,
            category_id: categories[0].id,
            name: 'Classic Burger',
            description: 'Beef patty with lettuce, tomato, and cheese',
            price: 12.99,
            available: true,
          },
          {
            restaurant_id: restaurantId,
            category_id: categories[0].id,
            name: 'Margherita Pizza',
            description: 'Fresh tomato, mozzarella, and basil',
            price: 14.99,
            available: true,
          },
          {
            restaurant_id: restaurantId,
            category_id: categories[0].id,
            name: 'Caesar Salad',
            description: 'Crisp romaine with Caesar dressing (Seasonal)',
            price: 9.99,
            available: false, // Demo unavailable item
          },
          {
            restaurant_id: restaurantId,
            category_id: categories[1].id,
            name: 'Truffle Fries',
            description: 'Crispy fries with truffle oil',
            price: 6.99,
            available: true,
          },
          {
            restaurant_id: restaurantId,
            category_id: categories[2].id,
            name: 'Craft Beer',
            description: 'Local IPA',
            price: 5.99,
            available: true,
          },
          {
            restaurant_id: restaurantId,
            category_id: categories[2].id,
            name: 'House Wine',
            description: 'Glass of red or white',
            price: 7.99,
            available: true,
          },
        ]);

      if (itemsError) throw itemsError;

      // 4. Create demo table
      const { error: tableError } = await supabase
        .from('tables')
        .insert([{
          restaurant_id: restaurantId,
          table_number: '5',
          qr_code: 'table-5-demo',
          active: true,
        }]);

      if (tableError) throw tableError;

      alert('Demo data setup complete! You can now start the live demo.');
      
    } catch (error) {
      console.error('Setup error:', error);
      alert('Error setting up demo data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Setup</h1>
        <p className="text-gray-600 mb-6">
          This will populate your database with sample menu items, categories, and a demo table for testing.
        </p>
        
        <button
          onClick={setupDemoData}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold"
        >
          {loading ? 'Setting Up Demo Data...' : 'Setup Demo Data'}
        </button>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> After setup, visit <code>/admin/demo</code> to start the live demo presentation.
          </p>
        </div>
      </div>
    </div>
  );
}