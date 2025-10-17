"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableForm } from "@/components/table-form"
import { QRCodeDialog } from "@/components/qr-code-dialog"
import { deleteTable } from "@/app/actions/tables"
import { Loader2 } from "lucide-react"

interface AdminTableCardProps {
  table: any
  restaurantId: string
}

export function AdminTableCard({ table, restaurantId }: AdminTableCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this table?")) return
    setDeleteLoading(true)
    await deleteTable(table.id)
    setDeleteLoading(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Table {table.table_number}</CardTitle>
            <Badge variant={table.active ? "default" : "secondary"}>{table.active ? "Active" : "Inactive"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-xs text-muted-foreground">QR Code</p>
              <p className="mt-1 truncate font-mono text-sm">{table.qr_code}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setQrOpen(true)}>
                View QR
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-transparent"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <TableForm open={editOpen} onOpenChange={setEditOpen} restaurantId={restaurantId} table={table} />
      <QRCodeDialog open={qrOpen} onOpenChange={setQrOpen} qrCode={table.qr_code} tableNumber={table.table_number} />
    </>
  )
}
