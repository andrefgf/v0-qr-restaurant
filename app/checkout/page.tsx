import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"

interface CheckoutPageProps {
  searchParams: Promise<{ orderId?: string; table?: string; demo?: string }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams
  const orderId = params.orderId
  const tableQrCode = params.table
  const demoMode = params.demo === "true"

  if (!orderId || !tableQrCode) {
    redirect("/")
  }

  const supabase = await createClient()

  // Get order details
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*), tables(*), restaurants(*)")
    .eq("id", orderId)
    .single()

  if (error || !order) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Order not found</h1>
          <p className="mt-2 text-muted-foreground">Please try again</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">Checkout</h1>
        </div>
      </header>
      <CheckoutForm order={order} tableQrCode={tableQrCode} demoMode={demoMode} />
    </div>
  )
}
