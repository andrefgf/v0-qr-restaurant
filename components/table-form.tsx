"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTable, updateTable } from "@/app/actions/tables"
import { Loader2 } from "lucide-react"

interface TableFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  restaurantId: string
  table?: {
    id: string
    table_number: string
    active: boolean
  }
}

export function TableForm({ open, onOpenChange, restaurantId, table }: TableFormProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    if (table) {
      await updateTable(table.id, formData)
    } else {
      formData.append("restaurant_id", restaurantId)
      await createTable(formData)
    }

    setLoading(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{table ? "Edit Table" : "Add Table"}</DialogTitle>
            <DialogDescription>
              {table ? "Update the table details." : "Add a new table to your restaurant."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="table_number">Table Number</Label>
              <Input id="table_number" name="table_number" defaultValue={table?.table_number} required />
            </div>

            {table && (
              <div className="grid gap-2">
                <Label htmlFor="active">Status</Label>
                <Select name="active" defaultValue={table.active ? "true" : "false"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {table ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
