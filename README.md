# QR Restaurant Ordering System

A complete QR-based restaurant ordering system built with Next.js, Supabase, and Stripe.

## 🚀 Quick Start

### 1. Setup Database

**You must run the database setup script first:**

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Copy the contents of `scripts/setup_database.sql`
4. Paste and click **Run**

This will create all tables, indexes, security policies, and seed demo data.

### 2. Generate QR Codes for Demo

Visit `/demo-setup` to:
- Generate QR codes for 50 tables (or any number you need)
- Download all QR code URLs
- Get step-by-step demo instructions

### 3. Test the App

After running the setup script:
- **Customer App**: Click any QR code URL from demo-setup (or `/menu?qr=demo`)
- **Admin Dashboard**: `/admin` - Manage orders, menu, and tables
- **Demo Mode**: Payment is automatically skipped for easy demonstration

## 📱 Features

### Customer Experience
- Scan QR code at table
- Browse menu by category
- Add items to cart with special instructions
- Secure checkout with Stripe (or demo mode for testing)
- Order confirmation and tracking

### Admin Dashboard
- Real-time order management
- Menu management (CRUD)
- Table management with QR codes
- Sales analytics
- Restaurant settings

### POS Integration
- RESTful API for POS systems
- Webhook support for real-time updates
- Order status synchronization
- See `docs/POS_API.md` for details

## 🎭 Demo Mode

The system runs in **demo mode** by default, which:
- Skips Stripe payment processing
- Shows full order flow without requiring payment setup
- Perfect for demonstrating to restaurant owners
- Automatically enabled for all orders

To enable real payments, see the Stripe configuration section below.

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Auth**: Supabase Auth

## 📚 Documentation

- `DEMO_GUIDE.md` - Complete guide for demoing to clients
- `docs/DATABASE_SETUP.md` - Database schema details
- `docs/POS_API.md` - POS integration guide

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Server-side payment validation
- API key authentication for POS endpoints
- HTTPS-only payment processing

## 💳 Stripe Configuration (Optional)

To enable real payments:

1. **Set up webhook endpoint** in Stripe Dashboard:
   - URL: `https://[your-domain]/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Add webhook secret** to environment variables:
   - Go to **Vars** section in v0 sidebar
   - Add: `STRIPE_WEBHOOK_SECRET` with value from Stripe

3. **Disable demo mode** in `app/cart/page.tsx`:
   - Change `demoMode={true}` to `demoMode={false}`

## 🎯 Next Steps

1. ✅ Run the database setup script
2. ✅ Visit `/demo-setup` to generate table QR codes
3. ✅ Test the customer flow with any QR code URL
4. ✅ Explore the admin dashboard at `/admin`
5. Customize restaurant branding and menu items
6. Print QR codes for physical tables
7. Configure Stripe for live payments (when ready)

## 🎬 Presenting to Clients

See `DEMO_GUIDE.md` for:
- 30-second elevator pitch
- Step-by-step demo script
- Key selling points
- Troubleshooting tips
