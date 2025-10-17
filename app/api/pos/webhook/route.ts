import { type NextRequest, NextResponse } from "next/server"

// POST /api/pos/webhook - Webhook endpoint for POS systems to receive order updates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { webhookUrl, restaurantId, events } = body

    if (!webhookUrl || !restaurantId || !Array.isArray(events)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // In production, you'd store webhook configurations in the database
    // For now, we'll just validate the format
    const validEvents = ["order.created", "order.updated", "payment.succeeded"]
    const invalidEvents = events.filter((e: string) => !validEvents.includes(e))

    if (invalidEvents.length > 0) {
      return NextResponse.json({ error: `Invalid events: ${invalidEvents.join(", ")}` }, { status: 400 })
    }

    return NextResponse.json({
      message: "Webhook registered successfully",
      webhookUrl,
      events,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
