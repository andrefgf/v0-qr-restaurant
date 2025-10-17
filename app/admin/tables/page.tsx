import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TableFormTrigger } from "@/components/table-form-trigger"
import { AdminTableCard } from "@/components/admin-table-card"

export default async function AdminTablesPage() {
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

  const { data: tables } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("table_number")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{restaurant.name} - Admin</h1>
          <nav className="flex gap-4">
            <a href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </a>
            <a href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Orders
            </a>
            <a href="/admin/menu" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Menu
            </a>
            <a href="/admin/tables" className="text-sm font-medium">
              Tables
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/40 p-6">
        <div className="container space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Table Management</h2>
              <p className="text-muted-foreground">Manage your restaurant tables and QR codes</p>
            </div>
            <TableFormTrigger restaurantId={restaurant.id} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables?.map((table) => (
              <AdminTableCard key={table.id} table={table} restaurantId={restaurant.id} />
            ))}

            {!tables || tables.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No tables yet</p>
                  <Button className="mt-4">Add Your First Table</Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
