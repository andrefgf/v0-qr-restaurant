import { createClient } from "@/lib/supabase/server"
import { MenuBrowser } from "@/components/menu-browser"
import { RestaurantHeader } from "@/components/restaurant-header"
import { redirect } from "next/navigation"

interface MenuPageProps {
  searchParams: Promise<{ qr?: string }> // Changed from 'table' to 'qr'
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams
  const tableQrCode = params.qr // Changed from params.table to params.qr

  if (!tableQrCode) {
    redirect("/")
  }

  const supabase = await createClient()

  // Get table info
  const { data: table, error: tableError } = await supabase
    .from("tables")
    .select("*, restaurants(*)")
    .eq("qr_code", tableQrCode)
    .single()

  if (tableError || !table) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Table not found</h1>
          <p className="mt-2 text-muted-foreground">Please scan a valid QR code</p>
        </div>
      </div>
    )
  }

  // Get menu categories and items
  const { data: categories } = await supabase
    .from("menu_categories")
    .select("*, menu_items(*)")
    .eq("restaurant_id", table.restaurant_id)
    .order("display_order")

  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader restaurant={table.restaurants} tableNumber={table.table_number} />
      <MenuBrowser categories={categories || []} tableId={table.id} restaurantId={table.restaurant_id} />
    </div>
  )
}
