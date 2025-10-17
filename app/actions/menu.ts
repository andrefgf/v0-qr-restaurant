"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const restaurantId = formData.get("restaurant_id") as string
  const categoryId = formData.get("category_id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("image_url") as string

  const { error } = await supabase.from("menu_items").insert({
    restaurant_id: restaurantId,
    category_id: categoryId,
    name,
    description,
    price,
    image_url: imageUrl || null,
    available: true,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/menu")
  return { success: true }
}

export async function updateMenuItem(itemId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const imageUrl = formData.get("image_url") as string
  const available = formData.get("available") === "true"

  const { error } = await supabase
    .from("menu_items")
    .update({
      name,
      description,
      price,
      image_url: imageUrl || null,
      available,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/menu")
  return { success: true }
}

export async function deleteMenuItem(itemId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from("menu_items").delete().eq("id", itemId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/menu")
  return { success: true }
}

export async function toggleMenuItemAvailability(itemId: string, available: boolean) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase.from("menu_items").update({ available }).eq("id", itemId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/menu")
  return { success: true }
}
