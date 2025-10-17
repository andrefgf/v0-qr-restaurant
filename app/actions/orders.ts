"use server"

import { createClient } from "@/lib/supabase/server"

interface OrderItem {
  menuItemId: string
  quantity: number
  price: number // Changed from priceCents to price (now in dollars)
  itemName: string
  specialInstructions?: string
}

interface CreateOrderData {
  tableId: string
  restaurantId: string
  items: OrderItem[]
  specialInstructions?: string
  subtotal: number // Changed from subtotalCents to subtotal
  tax: number // Changed from taxCents to tax
  total: number // Changed from totalCents to total
}

export async function createOrder(data: CreateOrderData) {
  try {
    const supabase = await createClient()

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        restaurant_id: data.restaurantId,
        table_id: data.tableId,
        status: "pending",
        subtotal: data.subtotal, // Using subtotal instead of subtotal_cents
        tax: data.tax, // Using tax instead of tax_cents
        total: data.total, // Using total instead of total_cents
        special_instructions: data.specialInstructions || null,
      })
      .select()
      .single()

    if (orderError) {
      console.error("[v0] Order creation error:", orderError)
      return { success: false, error: "Failed to create order" }
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menuItemId,
      quantity: item.quantity,
      price_at_time: item.price, // Using price instead of price_cents
      item_name: item.itemName,
      special_instructions: item.specialInstructions || null,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("[v0] Order items creation error:", itemsError)
      // Rollback: delete the order
      await supabase.from("orders").delete().eq("id", order.id)
      return { success: false, error: "Failed to create order items" }
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("[v0] Unexpected error creating order:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getOrder(orderId: string) {
  try {
    const supabase = await createClient()

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), tables(*), restaurants(*)")
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("[v0] Error fetching order:", error)
      return { success: false, error: "Order not found" }
    }

    return { success: true, order }
  } catch (error) {
    console.error("[v0] Unexpected error fetching order:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) {
      console.error("[v0] Error updating order status:", error)
      return { success: false, error: "Failed to update order status" }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Unexpected error updating order status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
