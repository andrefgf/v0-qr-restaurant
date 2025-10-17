"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createPaymentIntent } from "@/app/actions/payments"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  order: any
  tableQrCode: string
  demoMode?: boolean
}

export function CheckoutForm({ order, tableQrCode, demoMode = false }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (demoMode) {
      setLoading(false)
      return
    }

    const initializePayment = async () => {
      setLoading(true)
      const result = await createPaymentIntent(order.id)

      if (result.success && result.clientSecret) {
        setClientSecret(result.clientSecret)
      } else {
        setError(result.error || "Failed to initialize payment")
      }
      setLoading(false)
    }

    initializePayment()
  }, [order.id, demoMode])

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-2xl px-4 py-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button asChild className="mt-4">
              <Link href={`/menu?table=${tableQrCode}`}>Back to Menu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl px-4 py-6">
      {demoMode && (
        <div className="mb-6 rounded-lg border border-primary/50 bg-primary/10 p-4">
          <p className="text-sm font-medium text-primary">
            🎭 Demo Mode - Payment is disabled for demonstration purposes
          </p>
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.item_name}
                </span>
                <span className="font-medium">${(item.price_at_time * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {demoMode ? (
        <DemoCheckout orderId={order.id} tableQrCode={tableQrCode} />
      ) : (
        clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm orderId={order.id} tableQrCode={tableQrCode} total={order.total} />
          </Elements>
        )
      )}
    </div>
  )
}

function DemoCheckout({ orderId, tableQrCode }: { orderId: string; tableQrCode: string }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDemoCheckout = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push(`/order-confirmation?orderId=${orderId}&table=${tableQrCode}&demo=true`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            In demo mode, you can complete the order without payment. In production, customers would pay here.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
              <Link href={`/cart?table=${tableQrCode}`}>Back to Cart</Link>
            </Button>
            <Button onClick={handleDemoCheckout} className="flex-1" size="lg" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Order (Demo)"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentForm({
  orderId,
  tableQrCode,
  total,
}: {
  orderId: string
  tableQrCode: string
  total: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}&table=${tableQrCode}`,
      },
    })

    if (error) {
      setErrorMessage(error.message || "An error occurred during payment")
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />

          {errorMessage && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild className="flex-1 bg-transparent">
              <Link href={`/cart?table=${tableQrCode}`}>Back to Cart</Link>
            </Button>
            <Button type="submit" className="flex-1" size="lg" disabled={!stripe || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${total.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
