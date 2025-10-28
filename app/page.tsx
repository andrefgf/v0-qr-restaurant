// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [selectedTable, setSelectedTable] = useState<string>('1');

  // Demo tables data
  const tables = [
    { number: '1', status: 'available' },
    { number: '2', status: 'available' },
    { number: '3', status: 'occupied' },
    { number: '4', status: 'available' },
    { number: '5', status: 'available' },
  ];

  const tableUrl = (tableNumber: string) => {
    return `${window.location.origin}/table/${tableNumber}`;
  };

  const downloadQRCode = (tableNumber: string) => {
    const url = tableUrl(tableNumber);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `table-${tableNumber}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🍽️ QR Restaurant Ordering
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scan QR code at your table to order directly from your phone
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* QR Code Generator */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Generate Table QR Codes
            </h2>
            
            {/* Table Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Table Number:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {tables.map((table) => (
                  <button
                    key={table.number}
                    onClick={() => setSelectedTable(table.number)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTable === table.number
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      table.status === 'occupied' ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="font-semibold">Table {table.number}</div>
                    <div className={`text-xs mt-1 ${
                      table.status === 'available' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {table.status === 'available' ? 'Available' : 'Occupied'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code Display */}
            <div className="text-center mb-6">
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tableUrl(selectedTable))}`}
                  alt={`QR Code for Table ${selectedTable}`}
                  className="w-48 h-48 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-3">
                  Table {selectedTable} Ordering Link
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {tableUrl(selectedTable)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => downloadQRCode(selectedTable)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Download QR Code
              </button>
              <Link
                href={`/table/${selectedTable}`}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Test Table {selectedTable}
              </Link>
            </div>
          </div>

          {/* Instructions & Demo */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                📱 How It Works
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Scan QR Code</h4>
                    <p className="text-sm text-gray-600">Customer scans QR code at their table</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Browse & Order</h4>
                    <p className="text-sm text-gray-600">View menu and add items to cart</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Send to Kitchen</h4>
                    <p className="text-sm text-gray-600">Order goes directly to kitchen staff</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Demo */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🚀 Quick Demo
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Test the complete ordering system:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/table/1"
                    className="bg-blue-500 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
                  >
                    Table 1 Demo
                  </Link>
                  <Link
                    href="/table/2"
                    className="bg-green-500 text-white py-3 px-4 rounded-lg text-center hover:bg-green-600 transition-colors"
                  >
                    Table 2 Demo
                  </Link>
                </div>
                <Link
                  href="/admin/dashboard"
                  className="block w-full bg-orange-500 text-white py-3 px-4 rounded-lg text-center hover:bg-orange-600 transition-colors font-semibold"
                >
                  View Kitchen Dashboard
                </Link>
              </div>
            </div>

            {/* For Restaurant Owners */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                For Restaurant Owners
              </h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• No app installation required for customers</li>
                <li>• Works on any smartphone with a camera</li>
                <li>• Real-time order updates to kitchen</li>
                <li>• Reduce wait times and increase efficiency</li>
                <li>• Printable QR codes for each table</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}