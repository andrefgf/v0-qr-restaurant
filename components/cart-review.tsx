"use client"

import { useCart } from "@/lib/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createOrder } from "@/app/actions/orders"
import { Loader2 } from "lucide-react"

interface CartReviewProps {
  tableId: string
  restaurantId: string
  tableQrCode: string
  demoMode?: boolean
}

export function CartReview({ tableId, restaurantId, tableQrCode, demoMode = true }: CartReviewProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const subtotalCents = getTotalPrice()
  const taxCents = Math.round(subtotalCents * 0.1) // 10% tax
  const totalCents = subtotalCents + taxCents

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsSubmitting(true)
    try {
      const orderData = {
        tableId,
        restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          priceCents: item.priceCents,
          itemName: item.name,
          specialInstructions: item.specialInstructions,
        })),
        specialInstructions,
        subtotalCents,
        taxCents,
        totalCents,
      }

      const result = await createOrder(orderData)

      if (result.success && result.orderId) {
        clearCart()
        const checkoutUrl = demoMode
          ? `/checkout?orderId=${result.orderId}&table=${tableQrCode}&demo=true`
          : `/checkout?orderId=${result.orderId}&table=${tableQrCode}`
        router.push(checkoutUrl)
      } else {
        alert(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("[v0] Error creating order:", error)
      alert("Failed to create order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Add some items from the menu to get started</p>
          <Button asChild className="mt-6">
            <Link href={`/menu?table=${tableQrCode}`}>Browse Menu</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl px-4 py-6">
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.menuItemId}>
            <CardContent className="flex gap-4 p-4">
              {item.imageUrl && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.imageUrl || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  {item.specialInstructions && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.specialInstructions}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-destructive"
                    onClick={() => removeItem(item.menuItemId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold text-foreground">${((item.priceCents * item.quantity) / 100).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">${(item.priceCents / 100).toFixed(2)} each</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="p-4">
            <Label htmlFor="order-instructions">Special Instructions for Kitchen (Optional)</Label>
            <Textarea
              id="order-instructions"
              placeholder="Any special requests for your order..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${(subtotalCents / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="font-medium">${(taxCents / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${(totalCents / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href={`/menu?table=${tableQrCode}`}>Add More Items</Link>
          </Button>
          <Button className="flex-1" size="lg" onClick={handleCheckout} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
