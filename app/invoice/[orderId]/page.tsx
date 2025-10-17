import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function InvoicePage({ params }: { params: { orderId: string } }) {
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      tables (
        table_number,
        restaurants (
          name,
          logo_url
        )
      ),
      order_items (
        quantity,
        price_at_time,
        menu_items (
          name
        )
      ),
      invoices (
        invoice_number,
        created_at
      )
    `)
    .eq("id", params.orderId)
    .single()

  if (!order) {
    redirect("/")
  }

  const invoice = order.invoices?.[0]

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="container max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/order-confirmation">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Invoice</h1>
            {invoice && <p className="text-muted-foreground">{invoice.invoice_number}</p>}
          </div>
        </div>

        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{order.tables.restaurants.name}</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Table {order.tables.table_number} • {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              {invoice && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-mono font-semibold">{invoice.invoice_number}</p>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.menu_items.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.quantity * item.price_at_time).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.price_at_time.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {invoice && (
                <div className="border-t pt-4">
                  <Button className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Thank you for dining with us!
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
