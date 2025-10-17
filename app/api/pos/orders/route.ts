import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/auth/api-key"

// GET /api/pos/orders - Get all orders for a restaurant
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const { valid, restaurantId } = await validateApiKey(apiKey)

  if (!valid || !restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = req.nextUrl.searchParams
  const status = searchParams.get("status")
  const limit = Number.parseInt(searchParams.get("limit") || "50")

  try {
    const supabase = await createClient()

    let query = supabase
      .from("orders")
      .select("*, order_items(*), tables(*), payments(*)")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("[v0] Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
