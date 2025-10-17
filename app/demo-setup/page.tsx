import { createClient } from "@/lib/supabase/server"
import { DemoSetupForm } from "@/components/demo-setup-form"

export default async function DemoSetupPage() {
  const supabase = await createClient()

  // Get restaurant info
  const { data: restaurant } = await supabase.from("restaurants").select("*").single()

  // Get existing tables count
  const { count } = await supabase.from("tables").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">Demo Setup</h1>
        </div>
      </header>

      <div className="container max-w-4xl px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Restaurant Demo Setup</h2>
            <p className="mt-2 text-muted-foreground">
              Generate QR codes for your tables and prepare for your demo presentation
            </p>
          </div>

          {restaurant ? (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold">Restaurant: {restaurant.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Current tables: {count || 0}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
              <h3 className="font-semibold text-destructive">Database Not Set Up</h3>
              <p className="mt-2 text-sm">
                Please run the database setup script first. Check the README.md for instructions.
              </p>
            </div>
          )}

          <DemoSetupForm restaurantExists={!!restaurant} currentTableCount={count || 0} />
        </div>
      </div>
    </div>
  )
}
