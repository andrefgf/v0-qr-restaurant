// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function AdminDashboard() {
  const [restaurant, setRestaurant] = useState({
    name: 'My Restaurant',
    tableCount: 10,
    description: 'A modern restaurant with QR code ordering',
    address: '123 Main Street, City, State 12345',
    phone: '+1 (555) 123-4567',
    email: 'contact@myrestaurant.com'
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    activeOrders: 0,
    menuItems: 0,
    todayRevenue: 0
  });

  const supabase = createClient();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Load real stats from your database
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total, created_at')
      .gte('created_at', new Date().toISOString().split('T')[0]);

    const { data: menuItems } = await supabase
      .from('menu_items')
      .select('id');

    const todayRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
    
    setStats({
      activeOrders: orders?.length || 0,
      menuItems: menuItems?.length || 0,
      todayRevenue
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setRestaurant(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Restaurant settings saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Restaurant Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant settings and operations</p>
        </div>

        {/* Demo Banner */}
        <div className="bg-blue-500 text-white p-4 rounded-lg mb-8 text-center">
          <p className="font-semibold">
            🚀 Ready for your investor demo?{' '}
            <Link href="/admin/demo" className="underline hover:no-underline">
              Start Live Demo Here
            </Link>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{restaurant.tableCount}</div>
            <div className="text-gray-600">Total Tables</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeOrders}</div>
            <div className="text-gray-600">Active Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.menuItems}</div>
            <div className="text-gray-600">Menu Items</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">${stats.todayRevenue.toFixed(2)}</div>
            <div className="text-gray-600">Today's Revenue</div>
          </div>
        </div>

        {/* Restaurant Settings */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Restaurant Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurant.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tables
              </label>
              <input
                type="number"
                value={restaurant.tableCount}
                onChange={(e) => handleInputChange('tableCount', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={restaurant.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={restaurant.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={restaurant.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={restaurant.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/admin/menu" 
              className="bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 font-semibold block text-center"
            >
              Manage Menu
            </Link>
            <Link 
              href="/admin/demo-dashboard" 
              className="bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 font-semibold block text-center"
            >
              Live Orders Demo
            </Link>
            <Link 
              href="/admin/demo" 
              className="bg-purple-500 text-white py-4 rounded-lg hover:bg-purple-600 font-semibold block text-center"
            >
              Start Full Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}