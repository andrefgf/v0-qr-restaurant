import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { FileText, Download } from "lucide-react"

export default async function AdminInvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: restaurants } = await supabase.from("restaurants").select("*").limit(1)
  const restaurant = restaurants?.[0]

  if (!restaurant) {
    redirect("/admin")
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select(`
      *,
      orders (
        total,
        created_at,
        tables (
          table_number
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">{restaurant.name} - Admin</h1>
          <nav className="flex gap-4">
            <a href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Dashboard
            </a>
            <a href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Orders
            </a>
            <a href="/admin/menu" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Menu
            </a>
            <a href="/admin/tables" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Tables
            </a>
            <a href="/admin/invoices" className="text-sm font-medium">
              Invoices
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-muted/40 p-6">
        <div className="container space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Invoices</h2>
              <p className="text-muted-foreground">View and manage customer invoices</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoices && invoices.length > 0 ? (
                <div className="space-y-3">
                  {invoices.map((invoice: any) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-mono font-semibold">{invoice.invoice_number}</p>
                          <p className="text-sm text-muted-foreground">
                            Table {invoice.orders.tables.table_number} •{" "}
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">${invoice.orders.total.toFixed(2)}</p>
                          <Badge variant="default" className="mt-1">
                            Paid
                          </Badge>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/invoice/${invoice.order_id}`}>
                            <Download className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">No invoices yet</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
