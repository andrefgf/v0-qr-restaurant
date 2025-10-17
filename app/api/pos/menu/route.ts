import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { validateApiKey } from "@/lib/auth/api-key"

// GET /api/pos/menu - Get menu for a restaurant
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const { valid, restaurantId } = await validateApiKey(apiKey)

  if (!valid || !restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
      .from("menu_categories")
      .select("*, menu_items(*)")
      .eq("restaurant_id", restaurantId)
      .order("display_order")

    if (error) {
      console.error("[v0] Error fetching menu:", error)
      return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 })
    }

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/pos/menu/items/[itemId] - Update menu item availability
export async function PATCH(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key")
  const { valid, restaurantId } = await validateApiKey(apiKey)

  if (!valid || !restaurantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { itemId, isAvailable } = body

    if (!itemId || typeof isAvailable !== "boolean") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify item belongs to restaurant
    const { data: existingItem } = await supabase
      .from("menu_items")
      .select("id")
      .eq("id", itemId)
      .eq("restaurant_id", restaurantId)
      .single()

    if (!existingItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    const { data: item, error } = await supabase
      .from("menu_items")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", itemId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating menu item:", error)
      return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
