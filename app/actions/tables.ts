"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTable(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const restaurantId = formData.get("restaurant_id") as string
  const tableNumber = formData.get("table_number") as string

  // Generate unique QR code
  const qrCode = `${restaurantId}-table-${tableNumber}-${Date.now()}`

  const { error } = await supabase.from("tables").insert({
    restaurant_id: restaurantId,
    table_number: tableNumber,
    qr_code: qrCode,
    active: true,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/tables")
  return { success: true, qrCode }
}

export async function updateTable(tableId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const tableNumber = formData.get("table_number") as string
  const active = formData.get("active") === "true"

  const { error } = await supabase.from("tables").update({ table_number: tableNumber, active }).eq("id", tableId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/tables")
  return { success: true }
}

export async function deleteTable(tableId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from("tables").delete().eq("id", tableId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/tables")
  return { success: true }
}
