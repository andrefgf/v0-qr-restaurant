import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderStatusUpdater } from "@/components/order-status-updater"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: restaurants } = await supabase.from("restaurants").select("*").limit(1)
  const restaurant = restaurants?.[0]

  if (!restaurant) {
    redirect("/admin")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        menu_items (name)
      ),
      tables (*),
      payments (*)
    `)
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{restaurant.name} - Admin</h1>
          <nav className="flex gap-4">
            <a href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </a>
            <a href="/admin/orders" className="text-sm font-medium">
              Orders
            </a>
            <a href="/admin/menu" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Menu
            </a>
            <a href="/admin/tables" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Tables
            </a>
            <a href="/admin/invoices" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Invoices
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/40 p-6">
        <div className="container space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Orders</h2>
            <p className="text-muted-foreground">Manage and track customer orders</p>
          </div>

          <div className="space-y-4">
            {orders?.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Table {order.tables.table_number}</CardTitle>
                      <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                      <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.menu_items.name}
                          {item.special_instructions && (
                            <span className="ml-2 text-muted-foreground">({item.special_instructions})</span>
                          )}
                        </span>
                        <span className="font-medium">${(item.price_at_time * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.special_instructions && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> {order.special_instructions}
                      </p>
                    )}
                    <div className="flex justify-between border-t pt-2 font-bold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                    {order.payments?.[0] && (
                      <p className="text-sm text-muted-foreground">
                        Payment: <Badge variant="outline">{order.payments[0].status}</Badge>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {!orders || orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No orders yet</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
