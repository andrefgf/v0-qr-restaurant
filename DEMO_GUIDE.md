# QR Restaurant Demo Guide

This guide will help you demonstrate the QR restaurant ordering system to potential clients.

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup Database
1. Open `scripts/setup_database.sql`
2. Copy all the SQL code
3. Go to your Supabase dashboard → **SQL Editor**
4. Paste and click **Run**
5. Wait for "Success" message

### Step 2: Generate QR Codes
1. Visit `/demo-setup` in your preview
2. Enter number of tables (e.g., 50 for a restaurant)
3. Click **Generate Tables**
4. Download the QR code URLs

### Step 3: Test Customer Flow
1. Click any QR code URL from the generated list
2. Browse the menu (14 sample items across 4 categories)
3. Add items to cart
4. Review cart and place order
5. Complete checkout (payment is skipped in demo mode)
6. View order confirmation

### Step 4: Show Admin Dashboard
1. Visit `/auth/login`
2. Sign up with any email/password (for demo purposes)
3. View orders in real-time at `/admin/orders`
4. Manage menu items at `/admin/menu`
5. View all tables and QR codes at `/admin/tables`

---

## 📱 Customer Experience Demo Script

### "Imagine you're a customer at this restaurant..."

**1. Scan QR Code** (30 seconds)
- "You sit down at Table 5 and scan the QR code on your table"
- Open: `/menu?table=[qr-code]`
- Show: Restaurant branding, welcome message

**2. Browse Menu** (1 minute)
- "Browse through categories: Appetizers, Mains, Desserts, Drinks"
- Click on items to see details, images, descriptions
- "Everything is mobile-optimized and easy to read"

**3. Add to Cart** (1 minute)
- Add 2-3 items to demonstrate
- Show cart badge updating in real-time
- "Add special instructions like 'No onions' or 'Extra spicy'"

**4. Review Order** (30 seconds)
- Click cart icon
- Show order summary with prices
- "Customers can adjust quantities or remove items"
- Show tax calculation

**5. Place Order** (30 seconds)
- Click "Proceed to Payment"
- Show order summary
- "In demo mode, payment is skipped. In production, customers pay with card, Apple Pay, or Google Pay"
- Click "Complete Order (Demo)"

**6. Order Confirmation** (15 seconds)
- Show order number
- "Order goes directly to the kitchen"
- "Customer can view their receipt"

---

## 🎛️ Restaurant Owner Demo Script

### "Now let's see what you see as the restaurant owner..."

**1. Real-Time Orders** (1 minute)
- Visit `/admin/orders`
- "See all orders as they come in, in real-time"
- Show order details: table number, items, total
- Update order status: Pending → Preparing → Ready → Completed
- "Kitchen staff can mark orders as they progress"

**2. Menu Management** (1 minute)
- Visit `/admin/menu`
- "Add new items, edit prices, update descriptions"
- "Mark items as unavailable when you run out"
- "Upload food photos to make items more appealing"

**3. Table Management** (1 minute)
- Visit `/admin/tables`
- "View all your tables and their QR codes"
- Click "View QR" to see/download individual codes
- "Generate new tables anytime you need them"

**4. Dashboard Analytics** (30 seconds)
- Visit `/admin`
- Show daily revenue, order count
- "Track your business performance at a glance"

---

## 🎯 Key Selling Points

### For Restaurant Owners:
✅ **No App Download Required** - Customers just scan and order
✅ **Reduce Staff Workload** - Orders go directly to kitchen
✅ **Increase Order Accuracy** - No miscommunication
✅ **Faster Table Turnover** - Customers order immediately
✅ **Higher Average Order Value** - Customers browse full menu
✅ **Real-Time Updates** - See orders instantly
✅ **Easy Menu Updates** - Change prices/items anytime
✅ **Payment Integrated** - Secure Stripe payments

### For Customers:
✅ **Fast & Convenient** - Order from your phone
✅ **No Waiting** - Browse menu at your own pace
✅ **See Full Menu** - Photos and descriptions
✅ **Special Requests** - Add instructions easily
✅ **Secure Payment** - Apple Pay, Google Pay, cards
✅ **Digital Receipt** - Emailed automatically

---

## 🔧 Technical Features to Highlight

### Security & Compliance:
- PCI DSS compliant payments via Stripe
- Row Level Security on all database tables
- Server-side price validation (prevent tampering)
- HTTPS only

### Scalability:
- Built on Vercel + Supabase (handles high traffic)
- Real-time order updates via WebSockets
- Optimized images and caching
- Mobile-first PWA (works offline)

### Integration Ready:
- POS system API endpoints included
- Webhook support for order notifications
- Invoice generation system
- Email receipts (optional)

---

## 📊 Demo Data Included

The setup script creates:
- **1 Restaurant**: "The Gourmet Kitchen"
- **4 Menu Categories**: Appetizers, Mains, Desserts, Drinks
- **14 Menu Items**: With prices, descriptions, and placeholder images
- **Tables**: Generated on demand (you choose quantity)

---

## 🎬 30-Second Elevator Pitch

"This is a QR-based restaurant ordering system. Customers scan a QR code at their table, browse the menu on their phone, place their order, and pay - all without waiting for a server. Orders go directly to your kitchen in real-time. No app download required. It reduces staff workload, increases order accuracy, and speeds up table turnover. Built with Stripe for secure payments and Supabase for real-time updates."

---

## 🐛 Troubleshooting

**"Tables not found" error:**
- Run the database setup script first (`scripts/setup_database.sql`)

**"No menu items showing":**
- Database setup script includes sample menu items
- Check `/admin/menu` to verify items exist

**"Can't log in to admin":**
- Sign up first at `/auth/login` (no email verification in demo)
- Use any email/password for demo purposes

**"Payment not working":**
- Demo mode skips payment by default
- For real payments, configure Stripe webhook (see main README)

---

## 📞 Next Steps After Demo

1. **Customize branding** - Add restaurant logo, colors, theme
2. **Add real menu** - Replace sample items with actual menu
3. **Print QR codes** - Generate and print table QR codes
4. **Configure Stripe** - Set up live payment processing
5. **Train staff** - Show kitchen staff how to use order dashboard
6. **Soft launch** - Test with a few tables first
7. **Go live** - Roll out to all tables

---

## 💡 Pro Tips

- **Use a tablet** for the demo - Shows mobile experience better than laptop
- **Have two devices** - One for customer view, one for admin dashboard
- **Pre-load the demo** - Open all pages before meeting to avoid loading delays
- **Customize the sample menu** - Add items similar to the client's actual menu
- **Show the QR code** - Print one out or show on phone to make it tangible

---

**Questions? Issues?** Check the main README.md or contact support.
