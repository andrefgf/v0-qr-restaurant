import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MenuItemFormTrigger } from "@/components/menu-item-form-trigger"
import { AdminMenuItemCard } from "@/components/admin-menu-item-card"

export default async function AdminMenuPage() {
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

  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*, menu_items(*)")
    .eq("restaurant_id", restaurant.id)
    .order("display_order")

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
            <a href="/admin/menu" className="text-sm font-medium">
              Menu
            </a>
            <a href="/admin/tables" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Tables
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/40 p-6">
        <div className="container space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Menu Management</h2>
              <p className="text-muted-foreground">Manage your menu items and categories</p>
            </div>
            <MenuItemFormTrigger restaurantId={restaurant.id} categories={categories || []} />
          </div>

          <div className="space-y-6">
            {categories?.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {category.menu_items.map((item: any) => (
                      <AdminMenuItemCard
                        key={item.id}
                        item={item}
                        restaurantId={restaurant.id}
                        categories={categories}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {!categories || categories.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No menu items yet</p>
                  <Button className="mt-4">Add Your First Item</Button>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
