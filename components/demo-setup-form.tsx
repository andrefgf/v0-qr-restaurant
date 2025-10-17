"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, QrCode } from "lucide-react"
import { generateBulkTables } from "@/app/actions/demo"
import Link from "next/link"

interface DemoSetupFormProps {
  restaurantExists: boolean
  currentTableCount: number
}

export function DemoSetupForm({ restaurantExists, currentTableCount }: DemoSetupFormProps) {
  const [tableCount, setTableCount] = useState(50)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTables, setGeneratedTables] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    const result = await generateBulkTables(tableCount)

    if (result.success && result.tables) {
      setGeneratedTables(result.tables)
    } else {
      setError(result.error || "Failed to generate tables")
    }

    setIsGenerating(false)
  }

  const downloadQRCodes = () => {
    const content = generatedTables
      .map((table) => {
        const url = `${window.location.origin}/menu?table=${table.qr_code}`
        return `Table ${table.table_number}: ${url}`
      })
      .join("\n\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "qr-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!restaurantExists) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Setup Required</CardTitle>
          <CardDescription>Run the database setup script to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You need to run the SQL setup script first. Follow these steps:
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              <li>
                Open the <code className="rounded bg-muted px-1">scripts/setup_database.sql</code> file
              </li>
              <li>Copy all the SQL code</li>
              <li>Go to your Supabase dashboard → SQL Editor</li>
              <li>Paste and run the script</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Table QR Codes</CardTitle>
          <CardDescription>Create QR codes for your restaurant tables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tableCount">Number of Tables</Label>
            <Input
              id="tableCount"
              type="number"
              min="1"
              max="200"
              value={tableCount}
              onChange={(e) => setTableCount(Number(e.target.value))}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              {currentTableCount > 0 && `You currently have ${currentTableCount} tables. `}
              This will add {tableCount} new tables.
            </p>
          </div>

          {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <QrCode className="mr-2 h-4 w-4" />
                Generate {tableCount} Tables
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedTables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Tables</CardTitle>
            <CardDescription>{generatedTables.length} tables created successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Sample QR Code URLs:</p>
              <div className="mt-2 space-y-1">
                {generatedTables.slice(0, 3).map((table) => (
                  <div key={table.id} className="text-xs font-mono">
                    Table {table.table_number}:{" "}
                    <Link
                      href={`/menu?table=${table.qr_code}`}
                      className="text-primary hover:underline"
                      target="_blank"
                    >
                      /menu?table={table.qr_code}
                    </Link>
                  </div>
                ))}
                {generatedTables.length > 3 && (
                  <p className="text-xs text-muted-foreground">...and {generatedTables.length - 3} more</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={downloadQRCodes} variant="outline" className="flex-1 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download All URLs
              </Button>
              <Button asChild className="flex-1">
                <Link href="/admin/tables">View in Admin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Demo Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal space-y-3 pl-5 text-sm">
            <li>
              <strong>Generate tables above</strong> - Create QR codes for your demo
            </li>
            <li>
              <strong>Test the customer flow</strong> - Click any QR code URL to see the menu
            </li>
            <li>
              <strong>Add items to cart</strong> - Browse menu and add items
            </li>
            <li>
              <strong>Place order</strong> - Complete checkout (payment is skipped in demo mode)
            </li>
            <li>
              <strong>View in admin</strong> - Check orders in the{" "}
              <Link href="/admin/orders" className="text-primary hover:underline">
                admin dashboard
              </Link>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
