"use server"

import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"

export async function createPaymentIntent(orderId: string) {
  try {
    const supabase = await createClient()

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, restaurants(*)")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return { success: false, error: "Order not found" }
    }

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("status", "succeeded")
      .single()

    if (existingPayment) {
      return { success: false, error: "Order already paid" }
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total_cents,
      currency: "usd",
      metadata: {
        orderId: order.id,
        restaurantId: order.restaurant_id,
        tableId: order.table_id,
      },
      description: `Order at ${order.restaurants.name}`,
    })

    // Store payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: orderId,
      amount_cents: order.total_cents,
      status: "pending",
      stripe_payment_intent_id: paymentIntent.id,
      stripe_client_secret: paymentIntent.client_secret,
    })

    if (paymentError) {
      console.error("[v0] Error creating payment record:", paymentError)
      return { success: false, error: "Failed to create payment record" }
    }

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
    }
  } catch (error) {
    console.error("[v0] Error creating payment intent:", error)
    return { success: false, error: "Failed to create payment intent" }
  }
}

export async function updatePaymentStatus(paymentIntentId: string, status: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from("payments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_payment_intent_id", paymentIntentId)

    if (error) {
      console.error("[v0] Error updating payment status:", error)
      return { success: false, error: "Failed to update payment status" }
    }

    // If payment succeeded, update order status
    if (status === "succeeded") {
      const { data: payment } = await supabase
        .from("payments")
        .select("order_id")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .single()

      if (payment) {
        await supabase.from("orders").update({ status: "confirmed" }).eq("id", payment.order_id)
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating payment status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getPaymentStatus(orderId: string) {
  try {
    const supabase = await createClient()

    const { data: payment, error } = await supabase.from("payments").select("*").eq("order_id", orderId).single()

    if (error) {
      return { success: false, error: "Payment not found" }
    }

    return { success: true, payment }
  } catch (error) {
    console.error("[v0] Error fetching payment status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
