"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useRef, useState } from "react"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCode: string
  tableNumber: string
}

export function QRCodeDialog({ open, onOpenChange, qrCode, tableNumber }: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrUrl, setQrUrl] = useState("")

  useEffect(() => {
    if (open && canvasRef.current) {
      const url = `${window.location.origin}/menu?qr=${qrCode}`
      setQrUrl(url)

      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    }
  }, [open, qrCode])

  function downloadQR() {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `table-${tableNumber}-qr.png`
      link.href = url
      link.click()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Table {tableNumber} QR Code</DialogTitle>
          <DialogDescription>Scan this code to access the menu for this table.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <canvas ref={canvasRef} className="rounded-lg border" />
          <div className="w-full rounded-lg bg-muted p-3">
            <p className="text-center text-xs text-muted-foreground">URL</p>
            <p className="mt-1 break-all text-center font-mono text-xs">{qrUrl}</p>
          </div>
          <Button onClick={downloadQR} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
