import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/auth/api-key"

// GET /api/pos/orders/[orderId] - Get a specific order
export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const apiKey = req.headers.get("x-api-key")
  const { valid, restaurantId } = await validateApiKey(apiKey)

  if (!valid || !restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await params

  try {
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), tables(*), payments(*)")
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/pos/orders/[orderId] - Update order status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const apiKey = req.headers.get("x-api-key")
  const { valid, restaurantId } = await validateApiKey(apiKey)

  if (!valid || !restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await params

  try {
    const body = await req.json()
    const { status } = body

    if (!status || !["pending", "confirmed", "preparing", "ready", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify order belongs to restaurant
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .eq("restaurant_id", restaurantId)
      .single()

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
