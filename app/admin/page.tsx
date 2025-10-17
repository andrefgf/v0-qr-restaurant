import type React from "react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get restaurant for this user
  const { data: restaurants } = await supabase.from("restaurants").select("*").limit(1)

  const restaurant = restaurants?.[0]

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No restaurant found. Please contact support.</p>
      </div>
    )
  }

  // Get today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total, status")
    .eq("restaurant_id", restaurant.id)
    .gte("created_at", today.toISOString())

  const { data: allOrders } = await supabase.from("orders").select("id").eq("restaurant_id", restaurant.id)

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      *,
      tables (table_number),
      payments (status, amount)
    `)
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const todayRevenue = todayOrders?.reduce((sum, order) => sum + order.total, 0) || 0
  const todayOrderCount = todayOrders?.length || 0
  const totalOrders = allOrders?.length || 0
  const averageOrderValue = todayOrderCount > 0 ? todayRevenue / todayOrderCount : 0

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{restaurant.name} - Admin</h1>
          <nav className="flex gap-4">
            <Link href="/admin" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Orders
            </Link>
            <Link href="/admin/menu" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Menu
            </Link>
            <Link href="/admin/tables" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Tables
            </Link>
            <Link href="/admin/invoices" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Invoices
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/40 p-6">
        <div className="container space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Overview of your restaurant's performance</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${todayRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{todayOrderCount} orders today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Today's average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {todayOrders?.filter((o) => o.status !== "completed" && o.status !== "cancelled").length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Currently dining</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Table {order.tables.table_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          {order.payments && order.payments.length > 0 ? (
                            <Badge
                              variant={order.payments[0].status === "succeeded" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {order.payments[0].status}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No payment
                            </Badge>
                          )}
                        </div>
                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-muted-foreground">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild>
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/menu">Manage Menu</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/tables">Manage Tables</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/demo-setup">Demo Setup</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  )
}
