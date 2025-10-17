"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MenuItemForm } from "@/components/menu-item-form"

interface MenuItemFormTriggerProps {
  restaurantId: string
  categories: Array<{ id: string; name: string }>
}

export function MenuItemFormTrigger({ restaurantId, categories }: MenuItemFormTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Item</Button>
      <MenuItemForm open={open} onOpenChange={setOpen} restaurantId={restaurantId} categories={categories} />
    </>
  )
}
