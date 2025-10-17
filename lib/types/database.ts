export interface Restaurant {
  id: string
  name: string
  logo_url: string | null
  primary_color: string
  created_at: string
  updated_at: string
}

export interface Table {
  id: string
  restaurant_id: string
  table_number: string
  qr_code: string
  active: boolean // Changed from is_active to active
  created_at: string
  restaurants?: Restaurant // Added for joined queries
}

export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  display_order: number
  created_at: string
  menu_items?: MenuItem[] // Added for joined queries
}

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description: string | null
  price: number // Changed from price_cents to price (DECIMAL in database)
  image_url: string | null
  available: boolean // Changed from is_available to available
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  restaurant_id: string
  table_id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  subtotal: number // Changed from subtotal_cents to subtotal
  tax: number // Changed from tax_cents to tax
  total: number // Changed from total_cents to total
  special_instructions: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  price_at_time: number // Changed from price_cents to price_at_time
  special_instructions: string | null
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number // Changed from amount_cents to amount
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded"
  stripe_payment_intent_id: string | null
  payment_method: string | null
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  order_id: string
  invoice_number: string
  pdf_url: string | null
  created_at: string
}
