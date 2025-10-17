"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { MenuItemForm } from "@/components/menu-item-form"
import { deleteMenuItem, toggleMenuItemAvailability } from "@/app/actions/menu"
import { Loader2 } from "lucide-react"

interface AdminMenuItemCardProps {
  item: any
  restaurantId: string
  categories: Array<{ id: string; name: string }>
}

export function AdminMenuItemCard({ item, restaurantId, categories }: AdminMenuItemCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this item?")) return
    setDeleteLoading(true)
    await deleteMenuItem(item.id)
    setDeleteLoading(false)
  }

  async function handleToggleAvailability() {
    await toggleMenuItemAvailability(item.id, !item.available)
  }

  return (
    <>
      <Card>
        {item.image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
            <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              <p className="mt-2 font-bold text-primary">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={item.available ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={handleToggleAvailability}
              >
                {item.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <MenuItemForm
        open={editOpen}
        onOpenChange={setEditOpen}
        restaurantId={restaurantId}
        categories={categories}
        item={item}
      />
    </>
  )
}
