"use server"

import { createClient } from "@/lib/supabase/server"
import { generateInvoiceNumber, generateInvoiceHTML, type InvoiceData } from "@/lib/invoice-generator"

export async function createInvoice(orderId: string) {
  const supabase = await createClient()

  // Check if invoice already exists
  const { data: existingInvoice } = await supabase.from("invoices").select("*").eq("order_id", orderId).single()

  if (existingInvoice) {
    return { success: true, invoiceId: existingInvoice.id, invoiceNumber: existingInvoice.invoice_number }
  }

  // Fetch order details
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      tables (
        table_number,
        restaurants (
          name,
          logo_url
        )
      ),
      order_items (
        quantity,
        price_at_time,
        menu_items (
          name
        )
      )
    `)
    .eq("id", orderId)
    .single()

  if (!order) {
    return { error: "Order not found" }
  }

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber()

  // Prepare invoice data
  const invoiceData: InvoiceData = {
    invoiceNumber,
    orderId: order.id,
    restaurantName: order.tables.restaurants.name,
    restaurantLogo: order.tables.restaurants.logo_url,
    tableNumber: order.tables.table_number,
    orderDate: order.created_at,
    items: order.order_items.map((item: any) => ({
      name: item.menu_items.name,
      quantity: item.quantity,
      price: item.price_at_time,
      total: item.quantity * item.price_at_time,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
  }

  // Generate HTML invoice
  const invoiceHTML = generateInvoiceHTML(invoiceData)

  // Store invoice HTML as a data URL (in production, you'd upload to Blob storage)
  const invoiceDataUrl = `data:text/html;base64,${Buffer.from(invoiceHTML).toString("base64")}`

  // Save invoice to database
  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      order_id: orderId,
      invoice_number: invoiceNumber,
      pdf_url: invoiceDataUrl,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { success: true, invoiceId: invoice.id, invoiceNumber: invoice.invoice_number }
}

export async function getInvoice(orderId: string) {
  const supabase = await createClient()

  const { data: invoice } = await supabase.from("invoices").select("*").eq("order_id", orderId).single()

  if (!invoice) {
    return null
  }

  return invoice
}
