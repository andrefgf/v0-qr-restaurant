import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, QrCode, Utensils } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">QR Restaurant System</h1>
          <p className="text-lg text-gray-600">Modern ordering for modern restaurants</p>
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              <CardTitle>First Time Setup</CardTitle>
            </div>
            <CardDescription>
              Before using the system, you need to set up the database tables. This only takes 2 minutes!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-3">Setup Steps:</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Open Supabase SQL Editor</p>
                    <p className="text-gray-600">
                      Click the button below to open your Supabase dashboard, then go to SQL Editor
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Copy and run the setup script</p>
                    <p className="text-gray-600">
                      In your project files, find{" "}
                      <code className="bg-gray-100 px-1 rounded">scripts/setup_database.sql</code>
                    </p>
                    <p className="text-gray-600 mt-1">
                      Copy all the SQL code and paste it into the Supabase SQL Editor, then click "Run"
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Start using the system</p>
                    <p className="text-gray-600">Once the script runs successfully, click "Try Demo Menu" below</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">What gets created:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>8 database tables</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Security policies (RLS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Demo restaurant data</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Sample menu (14 items)</span>
                </li>
              </ul>
            </div>

            <Button asChild className="w-full">
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <Database className="mr-2 h-4 w-4" />
                Open Supabase Dashboard
              </a>
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <QrCode className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>Customer Experience</CardTitle>
              <CardDescription>Scan QR codes, browse menus, and place orders instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/menu?qr=demo">
                  <Utensils className="mr-2 h-4 w-4" />
                  Try Demo Menu
                </Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">Run setup script first</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Database className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>Setup Tables</CardTitle>
              <CardDescription>Generate QR codes for all your restaurant tables</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/demo-setup">Setup 50 Tables</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">After database setup</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle2 className="h-12 w-12 text-orange-500 mb-2" />
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>Manage orders, menus, and restaurant settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin">Go to Dashboard</Link>
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">After database setup</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardHeader>
            <CardTitle>Demo Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">For Restaurant Owners:</h4>
                <ol className="space-y-1 list-decimal list-inside text-gray-700">
                  <li>Run the database setup script</li>
                  <li>Generate QR codes for your tables</li>
                  <li>Print and place QR codes on tables</li>
                  <li>Customers scan to order</li>
                  <li>Monitor orders in admin dashboard</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Demo Features:</h4>
                <ul className="space-y-1 list-disc list-inside text-gray-700">
                  <li>Payment skipped (demo mode)</li>
                  <li>Full menu browsing</li>
                  <li>Cart management</li>
                  <li>Order tracking</li>
                  <li>QR code generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
