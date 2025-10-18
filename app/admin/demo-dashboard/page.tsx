// app/admin/demo-dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  table_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
  tables: { table_number: string };
}

interface OrderItem {
  id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  special_instructions: string;
  menu_items: {
    name: string;
  };
}

export default function DemoDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [restaurant, setRestaurant] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    loadRestaurantAndData();
    
    // Real-time subscription for new orders
    const subscription = supabase
      .channel('orders-demo')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          loadOrderWithDetails(payload.new.id);
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => prev.map(order => 
            order.id === payload.new.id ? { ...order, ...payload.new } : order
          ));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadRestaurantAndData = async () => {
    // Get restaurant
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: restaurants } = await supabase
      .from('restaurants')
      .select('*')
      .limit(1);

    if (restaurants?.[0]) {
      setRestaurant(restaurants[0]);
      await loadOrders(restaurants[0].id);
      await loadMenuItems(restaurants[0].id);
    }
  };

  const loadOrders = async (restaurantId: string) => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            name
          )
        ),
        tables (
          table_number
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setOrders(data);
  };

  const loadOrderWithDetails = async (orderId: string) => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (
            name
          )
        ),
        tables (
          table_number
        )
      `)
      .eq('id', orderId)
      .single();

    if (data) {
      setOrders(prev => [data, ...prev]);
    }
  };

  const loadMenuItems = async (restaurantId: string) => {
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('name');

    if (data) setMenuItems(data);
  };

  const toggleItemAvailability = async (itemId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ available: !currentStatus })
      .eq('id', itemId);

    if (!error) {
      setMenuItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, available: !currentStatus } : item
      ));
      alert(`Menu updated! This change is live for customers.`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading Demo Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{restaurant.name} - Live Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time order management • Demo Mode</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">📱 Live Orders</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Table {order.tables?.table_number}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                      <p className="text-sm font-medium">Order #{order.id.slice(-6)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    {order.order_items.map((item: OrderItem) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.menu_items.name}
                          {item.special_instructions && (
                            <span className="text-gray-500 text-xs block">Note: {item.special_instructions}</span>
                          )}
                        </span>
                        <span>€{(item.price_at_time * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="font-semibold">€{order.total.toFixed(2)}</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                      >
                        Start Prep
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Mark Ready
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">🍕</div>
                  <p className="text-lg">No orders yet</p>
                  <p className="text-sm">Scan the QR code to place your first order!</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Management */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">📊 Live Menu Control</h2>
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">€{item.price.toFixed(2)}</p>
                      <p className={`text-xs ${
                        item.available ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.available ? '✅ Available' : '❌ Unavailable'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleItemAvailability(item.id, item.available)}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        item.available 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {item.available ? 'Make Unavailable' : 'Make Available'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Features Showcase */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">🚀 Demo Features</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600">⚡</div>
                  <div>
                    <div className="font-medium">Real-time Orders</div>
                    <div className="text-blue-600">Orders appear instantly as customers pay</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600">📱</div>
                  <div>
                    <div className="font-medium">Live Menu Updates</div>
                    <div className="text-green-600">Toggle availability - customers see changes immediately</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="text-purple-600">💡</div>
                  <div>
                    <div className="font-medium">Smart Upsells</div>
                    <div className="text-purple-600">Automatic drink suggestions increase order value</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="text-orange-600">📧</div>
                  <div>
                    <div className="font-medium">Automated Invoicing</div>
                    <div className="text-orange-600">Instant receipts and payment tracking</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}