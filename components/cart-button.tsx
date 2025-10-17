"use client"

import { useCart } from "@/lib/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { ShoppingCart } from "lucide-react"

export function CartButton() {
  const { getTotalItems } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tableQrCode = searchParams.get("qr")

  const totalItems = getTotalItems()

  const handleClick = () => {
    if (tableQrCode) {
      router.push(`/cart?qr=${tableQrCode}`)
    }
  }

  return (
    <Button onClick={handleClick} className="relative" size="icon" variant={totalItems > 0 ? "default" : "outline"}>
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
          {totalItems}
        </span>
      )}
    </Button>
  )
}
