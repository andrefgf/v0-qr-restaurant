"use server"

import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function generateBulkTables(count: number) {
  try {
    const supabase = await createClient()

    // Get restaurant
    const { data: restaurant, error: restaurantError } = await supabase.from("restaurants").select("id").single()

    if (restaurantError || !restaurant) {
      return { success: false, error: "Restaurant not found. Please run database setup first." }
    }

    // Get current max table number
    const { data: existingTables } = await supabase
      .from("tables")
      .select("table_number")
      .order("table_number", { ascending: false })
      .limit(1)

    const startNumber = existingTables?.[0]?.table_number ? existingTables[0].table_number + 1 : 1

    // Generate tables
    const tables = Array.from({ length: count }, (_, i) => ({
      restaurant_id: restaurant.id,
      table_number: startNumber + i,
      qr_code: nanoid(10),
    }))

    const { data, error } = await supabase.from("tables").insert(tables).select()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, tables: data }
  } catch (error) {
    return { success: false, error: "Failed to generate tables" }
  }
}
