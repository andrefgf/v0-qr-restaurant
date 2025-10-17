import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, FileText } from "lucide-react"
import { createInvoice } from "@/app/actions/invoices"

interface OrderConfirmationPageProps {
  searchParams: Promise<{ orderId?: string; table?: string; payment_intent?: string }>
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const params = await searchParams
  const orderId = params.orderId
  const tableQrCode = params.table
  const paymentIntentId = params.payment_intent

  if (!orderId || !tableQrCode) {
    redirect("/")
  }

  const supabase = await createClient()

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        menu_items (name)
      ),
      tables (
        table_number,
        restaurants (name)
      )
    `)
    .eq("id", orderId)
    .single()

  if (orderError || !order) {
    redirect("/")
  }

  // Get payment details
  const { data: payment } = await supabase.from("payments").select("*").eq("order_id", orderId).single()

  let invoice = null
  if (payment?.status === "succeeded") {
    const { data: existingInvoice } = await supabase.from("invoices").select("*").eq("order_id", orderId).single()

    if (!existingInvoice) {
      await createInvoice(orderId)
    }

    const { data: invoiceData } = await supabase.from("invoices").select("*").eq("order_id", orderId).single()

    invoice = invoiceData
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">Thank you for your order</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Restaurant</span>
              <span className="font-medium">{order.tables.restaurants.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Table</span>
              <span className="font-medium">{order.tables.table_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Status</span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
            {payment && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="font-medium capitalize">{payment.status}</span>
              </div>
            )}
            {invoice && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invoice Number</span>
                <span className="font-mono font-medium">{invoice.invoice_number}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Items Ordered</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.menu_items.name}
                </span>
                <span className="font-medium">${(item.quantity * item.price_at_time).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-bold">
              <span>Total Paid</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {invoice && (
            <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
              <Link href={`/invoice/${orderId}`}>
                <FileText className="mr-2 h-4 w-4" />
                View Invoice
              </Link>
            </Button>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Your order has been sent to the kitchen. We'll bring it to your table shortly!
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href={`/menu?qr=${tableQrCode}`}>Order More Items</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
