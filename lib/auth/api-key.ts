import "server-only"

import { createClient } from "@/lib/supabase/server"

export async function validateApiKey(apiKey: string | null): Promise<{ valid: boolean; restaurantId?: string }> {
  if (!apiKey) {
    return { valid: false }
  }

  // For demo purposes, we'll use a simple API key format: "restaurant_[restaurant_id]_[secret]"
  // In production, you'd want to store hashed API keys in the database
  const match = apiKey.match(/^restaurant_([a-f0-9-]+)_(.+)$/)

  if (!match) {
    return { valid: false }
  }

  const restaurantId = match[1]
  const secret = match[2]

  // Verify the restaurant exists
  const supabase = await createClient()
  const { data: restaurant } = await supabase.from("restaurants").select("id").eq("id", restaurantId).single()

  if (!restaurant) {
    return { valid: false }
  }

  // In production, verify the secret against a stored hash
  // For demo, we'll accept any secret that's at least 32 characters
  if (secret.length < 32) {
    return { valid: false }
  }

  return { valid: true, restaurantId }
}
