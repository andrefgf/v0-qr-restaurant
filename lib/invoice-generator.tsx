import { createClient } from "@/lib/supabase/server"

export async function generateInvoiceNumber(): Promise<string> {
  const supabase = await createClient()

  // Get the count of existing invoices to generate a sequential number
  const { count } = await supabase.from("invoices").select("*", { count: "exact", head: true })

  const invoiceNumber = `INV-${String((count || 0) + 1).padStart(6, "0")}`
  return invoiceNumber
}

export interface InvoiceData {
  invoiceNumber: string
  orderId: string
  restaurantName: string
  restaurantLogo?: string
  tableNumber: string
  orderDate: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
}

export function generateInvoiceHTML(data: InvoiceData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${data.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
    .invoice { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e5e5; }
    .logo { font-size: 24px; font-weight: bold; color: #FF6B35; }
    .invoice-details { text-align: right; }
    .invoice-number { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
    .date { color: #666; font-size: 14px; }
    .info-section { margin-bottom: 30px; }
    .info-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .info-value { font-size: 16px; font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    thead { background: #f8f8f8; }
    th { text-align: left; padding: 12px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e5e5e5; }
    td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
    .item-name { font-weight: 500; }
    .quantity { text-align: center; color: #666; }
    .price, .total { text-align: right; }
    .totals { margin-top: 20px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 12px; }
    .totals-row.subtotal { color: #666; }
    .totals-row.tax { color: #666; }
    .totals-row.total { font-size: 18px; font-weight: bold; background: #f8f8f8; margin-top: 8px; padding: 12px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #999; font-size: 12px; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo">${data.restaurantName}</div>
      <div class="invoice-details">
        <div class="invoice-number">${data.invoiceNumber}</div>
        <div class="date">${new Date(data.orderDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
      </div>
    </div>

    <div class="info-section">
      <div class="info-label">Table</div>
      <div class="info-value">Table ${data.tableNumber}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="quantity">Qty</th>
          <th class="price">Price</th>
          <th class="total">Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.items
          .map(
            (item) => `
          <tr>
            <td class="item-name">${item.name}</td>
            <td class="quantity">${item.quantity}</td>
            <td class="price">$${item.price.toFixed(2)}</td>
            <td class="total">$${item.total.toFixed(2)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row subtotal">
        <span>Subtotal</span>
        <span>$${data.subtotal.toFixed(2)}</span>
      </div>
      <div class="totals-row tax">
        <span>Tax</span>
        <span>$${data.tax.toFixed(2)}</span>
      </div>
      <div class="totals-row total">
        <span>Total</span>
        <span>$${data.total.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      Thank you for dining with us!
    </div>
  </div>
</body>
</html>
  `
}
