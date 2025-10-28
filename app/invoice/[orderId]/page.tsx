// app/invoice/[orderId]/page.tsx
import { use } from 'react';

export default function InvoicePage({ 
  params 
}: { 
  params: Promise<{ orderId: string }> 
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  
  // Rest of your component code using orderId
  return (
    <div>
      Invoice for order: {orderId}
    </div>
  );
}