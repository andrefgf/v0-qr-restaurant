"use client"

import { useState } from "react"
import type { MenuCategory, MenuItem } from "@/lib/types/database"
import { MenuItemCard } from "@/components/menu-item-card"
import { MenuItemModal } from "@/components/menu-item-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MenuBrowserProps {
  categories: (MenuCategory & { menu_items: MenuItem[] })[]
  tableId: string
  restaurantId: string
}

export function MenuBrowser({ categories, tableId, restaurantId }: MenuBrowserProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  if (categories.length === 0) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">No menu items available at the moment.</p>
      </div>
    )
  }

  return (
    <>
      <div className="container py-6">
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="whitespace-nowrap">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.menu_items
                  .filter((item) => item.available)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
                  ))}
              </div>
              {category.menu_items.filter((item) => item.available).length === 0 && (
                <p className="text-center text-sm text-muted-foreground">No items available in this category.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {selectedItem && <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} tableId={tableId} />}
    </>
  )
}
