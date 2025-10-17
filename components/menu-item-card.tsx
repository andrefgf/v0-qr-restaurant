"use client"

import type { MenuItem } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface MenuItemCardProps {
  item: MenuItem
  onClick: () => void
}

export function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const priceFormatted = item.price.toFixed(2)

  return (
    <Card className="cursor-pointer overflow-hidden transition-all hover:shadow-lg" onClick={onClick}>
      {item.image_url && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            {item.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
            {item.allergens && item.allergens.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Allergens: {item.allergens.join(", ")}</p>
            )}
          </div>
          <span className="shrink-0 font-bold text-primary">${priceFormatted}</span>
        </div>
      </CardContent>
    </Card>
  )
}
