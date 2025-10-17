import { createClient } from "@/lib/supabase/server"
import { CartReview } from "@/components/cart-review"
import { redirect } from "next/navigation"

interface CartPageProps {
  searchParams: Promise<{ table?: string }>
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const params = await searchParams
  const tableQrCode = params.table

  if (!tableQrCode) {
    redirect("/")
  }

  const supabase = await createClient()

  // Get table and restaurant info
  const { data: table, error: tableError } = await supabase
    .from("tables")
    .select("*, restaurants(*)")
    .eq("qr_code", tableQrCode)
    .single()

  if (tableError || !table) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">Your Order</h1>
        </div>
      </header>
      <CartReview tableId={table.id} restaurantId={table.restaurant_id} tableQrCode={tableQrCode} demoMode={true} />
    </div>
  )
}
