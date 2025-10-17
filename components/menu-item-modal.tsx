"use client"

import { useState } from "react"
import type { MenuItem } from "@/lib/types/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useCart } from "@/lib/hooks/use-cart"

interface MenuItemModalProps {
  item: MenuItem
  onClose: () => void
  tableId: string
}

export function MenuItemModal({ item, onClose, tableId }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [specialInstructions, setSpecialInstructions] = useState("")
  const { addItem } = useCart()

  const priceFormatted = item.price.toFixed(2)
  const totalPrice = (item.price * quantity).toFixed(2)

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price, // Changed from priceCents to price
      quantity,
      specialInstructions: specialInstructions || undefined,
      imageUrl: item.image_url || undefined,
    })
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>

        {item.image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            {item.allergens && item.allergens.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                <strong>Allergens:</strong> {item.allergens.join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <span className="font-semibold">Price</span>
            <span className="text-lg font-bold text-primary">${priceFormatted}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                +
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., No onions, extra sauce..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </div>

          <Button className="w-full" size="lg" onClick={handleAddToCart}>
            Add to Cart - ${totalPrice}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
