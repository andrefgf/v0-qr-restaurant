import type { Restaurant } from "@/lib/types/database"
import Image from "next/image"
import { CartButton } from "@/components/cart-button"

interface RestaurantHeaderProps {
  restaurant: Restaurant
  tableNumber: string
}

export function RestaurantHeader({ restaurant, tableNumber }: RestaurantHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {restaurant.logo_url && (
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={restaurant.logo_url || "/placeholder.svg"}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold text-foreground">{restaurant.name}</h1>
            <p className="text-xs text-muted-foreground">Table {tableNumber}</p>
          </div>
        </div>
        <CartButton />
      </div>
    </header>
  )
}
