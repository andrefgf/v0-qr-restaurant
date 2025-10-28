// app/admin/qr-codes/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function QRCodesPage() {
  const [baseUrl, setBaseUrl] = useState('');
  const tables = ['1', '2', '3', '4', '5', '6', '7', '8'];

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const tableUrl = (tableNumber: string) => {
    return `${baseUrl}/table/${tableNumber}`;
  };

  const downloadAllQRCodes = () => {
    if (!baseUrl) return;
    
    tables.forEach((table) => {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl(table))}`;
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `table-${table}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  if (!baseUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading QR codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ... rest of your component */}
      </div>
    </div>
  );
}