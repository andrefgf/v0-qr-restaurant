"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TableForm } from "@/components/table-form"

interface TableFormTriggerProps {
  restaurantId: string
}

export function TableFormTrigger({ restaurantId }: TableFormTriggerProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Table</Button>
      <TableForm open={open} onOpenChange={setOpen} restaurantId={restaurantId} />
    </>
  )
}
