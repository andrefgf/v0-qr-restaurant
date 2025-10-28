// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Order {
  id: string;
  table_id: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total: number;
  items: any[];
  created_at: string;
}

interface Table {
  id: string;
  table_number: string;
  status: 'available' | 'occupied' | 'cleaning';
}

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
    
    // Real-time subscriptions
    const ordersSubscription = supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    const tablesSubscription = supabase
      .channel('tables')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tables' },
        () => {
          loadTables();
        }
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
      tablesSubscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadOrders(), loadTables()]);
    setLoading(false);
  };

  const loadOrders = async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && ordersData) {
      setOrders(ordersData);
    }
  };

  const loadTables = async () => {
    const { data: tablesData, error } = await supabase
      .from('tables')
      .select('id, table_number, status')
      .order('table_number');

    if (!error && tablesData) {
      setTables(tablesData);
    } else {
      // Fallback demo tables
      setTables([
        { id: '1', table_number: '1', status: 'available' },
        { id: '2', table_number: '2', status: 'occupied' },
        { id: '3', table_number: '3', status: 'available' },
        { id: '4', table_number: '4', status: 'occupied' },
        { id: '5', table_number: '5', status: 'available' },
      ]);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (!error) {
      setOrders(current =>
        current.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    }
  };

  const updateTableStatus = async (tableId: string, status: Table['status']) => {
    const { error } = await supabase
      .from('tables')
      .update({ status })
      .eq('id', tableId);

    if (!error) {
      setTables(current =>
        current.map(table =>
          table.id === tableId ? { ...table, status } : table
        )
      );
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading kitchen dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time order management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{tables.length}</div>
            <div className="text-sm text-gray-600">Total Tables</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xl font-bold text-green-600">{availableTables}</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xl font-bold text-orange-600">{pendingOrders.length}</div>
            <div className="text-sm text-gray-600">New Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xl font-bold text-yellow-600">{preparingOrders.length}</div>
            <div className="text-sm text-gray-600">Cooking</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-xl font-bold text-red-600">{readyOrders.length}</div>
            <div className="text-sm text-gray-600">Ready</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* New Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-orange-500 text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-semibold">🆕 New Orders ({pendingOrders.length})</h2>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {pendingOrders.map(order => (
                <div key={order.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">Table {order.table_id}</h3>
                      <p className="text-sm text-gray-600">
                        {getTimeAgo(order.created_at)}
                      </p>
                    </div>
                    <span className="font-bold text-orange-700">${order.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="mb-4 space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          <span className="font-medium">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="text-gray-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Start Cooking
                  </button>
                </div>
              ))}
              {pendingOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No new orders</p>
                  <p className="text-sm">Waiting for customer orders...</p>
                </div>
              )}
            </div>
          </div>

          {/* Cooking & Ready Orders */}
          <div className="space-y-6">
            {/* Cooking Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-yellow-500 text-white px-4 py-3 rounded-t-lg">
                <h2 className="text-lg font-semibold">👨‍🍳 Cooking ({preparingOrders.length})</h2>
              </div>
              <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
                {preparingOrders.map(order => (
                  <div key={order.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Table {order.table_id}</h3>
                        <p className="text-sm text-gray-600">
                          {getTimeAgo(order.created_at)}
                        </p>
                      </div>
                      <span className="font-bold text-yellow-700">${order.total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full bg-yellow-500 text-white py-2 px-4 rounded font-semibold hover:bg-yellow-600 transition-colors"
                    >
                      Mark Ready
                    </button>
                  </div>
                ))}
                {preparingOrders.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No orders cooking</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ready Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="bg-red-500 text-white px-4 py-3 rounded-t-lg">
                <h2 className="text-lg font-semibold">✅ Ready to Serve ({readyOrders.length})</h2>
              </div>
              <div className="p-4 space-y-3 max-h-[280px] overflow-y-auto">
                {readyOrders.map(order => (
                  <div key={order.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Table {order.table_id}</h3>
                        <p className="text-sm text-gray-600">
                          {getTimeAgo(order.created_at)}
                        </p>
                      </div>
                      <span className="font-bold text-red-700">${order.total.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded font-semibold hover:bg-red-600 transition-colors"
                    >
                      Mark Served
                    </button>
                  </div>
                ))}
                {readyOrders.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No orders ready</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tables Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-semibold">Tables</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {tables.map(table => (
                  <div
                    key={table.id}
                    className={`p-3 rounded-lg text-white text-center transition-all ${
                      table.status === 'available' ? 'bg-green-500 hover:bg-green-600' :
                      table.status === 'occupied' ? 'bg-red-500 hover:bg-red-600' :
                      'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-bold text-md">Table {table.table_number}</div>
                    <div className="text-xs capitalize mb-2 opacity-90">{table.status}</div>
                    <select
                      value={table.status}
                      onChange={(e) => updateTableStatus(table.id, e.target.value as Table['status'])}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs bg-black bg-opacity-30 text-white border-none rounded px-1 py-1 w-full"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="cleaning">Cleaning</option>
                    </select>
                  </div>
                ))}
              </div>
              
              {/* Table Status Legend */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 justify-center text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    <span>Cleaning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Completed Orders */}
        {completedOrders.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="bg-gray-500 text-white px-4 py-3 rounded-t-lg">
              <h2 className="text-lg font-semibold">📊 Recently Served ({completedOrders.length})</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.slice(0, 6).map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">Table {order.table_id}</h3>
                        <p className="text-sm text-gray-600">{getTimeAgo(order.created_at)}</p>
                      </div>
                      <span className="font-bold text-gray-700">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}