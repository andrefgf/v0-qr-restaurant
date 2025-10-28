// app/admin/qr-codes/page.tsx
'use client';

export default function QRCodesPage() {
  const tables = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const tableUrl = (tableNumber: string) => {
    return `${window.location.origin}/table/${tableNumber}`;
  };

  const downloadAllQRCodes = () => {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
            <p className="text-gray-600">Print and place these QR codes on your tables</p>
          </div>
          <button
            onClick={downloadAllQRCodes}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold"
          >
            Download All QR Codes
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div key={table} className="bg-white rounded-lg shadow p-6 text-center">
              <div className="mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(tableUrl(table))}`}
                  alt={`QR Code for Table ${table}`}
                  className="w-full max-w-[150px] mx-auto"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Table {table}</h3>
              <p className="text-sm text-gray-600 mb-3">
                Scan to order
              </p>
              <div className="space-y-2">
                <a
                  href={`/table/${table}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-green-500 text-white py-2 px-4 rounded text-sm hover:bg-green-600"
                >
                  Test Link
                </a>
                <button
                  onClick={() => {
                    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tableUrl(table))}`;
                    const link = document.createElement('a');
                    link.href = qrCodeUrl;
                    link.download = `table-${table}-qrcode.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Printing Instructions */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Printing Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Recommended Setup:</h4>
              <ul className="text-sm space-y-1">
                <li>• Print QR codes at 3x3 inches (7.5x7.5 cm)</li>
                <li>• Use laminated cards for durability</li>
                <li>• Place on table stands or tent cards</li>
                <li>• Ensure good lighting for easy scanning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="text-sm space-y-1">
                <li>• Test each QR code before placing</li>
                <li>• Have staff demonstrate the first time</li>
                <li>• Keep tables clean for better scanning</li>
                <li>• Train staff on the kitchen dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}