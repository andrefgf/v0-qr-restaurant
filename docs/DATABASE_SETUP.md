# Database Setup Instructions

## Quick Start

To set up your database, follow these steps:

### 1. Run the Setup Script

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the contents of `scripts/000_setup_complete_database.sql`
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl/Cmd + Enter`

This will create all the necessary tables, indexes, and Row Level Security policies.

### 2. Add Demo Data (Optional but Recommended)

1. In the SQL Editor, create another new query
2. Copy the contents of `scripts/001_seed_demo_data.sql`
3. Paste it into the SQL Editor
4. Click **Run**

This will populate your database with:
- A demo restaurant called "The Gourmet Kitchen"
- 5 tables (Table 1-5) with QR codes
- 4 menu categories (Appetizers, Main Courses, Desserts, Beverages)
- 14 menu items with prices and descriptions

### 3. Test the App

After running both scripts, you can test the app by visiting:

\`\`\`
/menu?qr=demo
\`\`\`

This will load the menu for Table 1 at the demo restaurant.

## Database Schema Overview

### Tables Created

1. **restaurants** - Restaurant information and branding
2. **tables** - Physical tables with QR codes
3. **menu_categories** - Menu organization
4. **menu_items** - Food and drink items
5. **orders** - Customer orders
6. **order_items** - Line items in orders
7. **payments** - Payment tracking with Stripe
8. **invoices** - Receipt generation

### Security

All tables have Row Level Security (RLS) enabled with policies that:
- Allow public read access to menus and restaurant info
- Allow customers to create orders and payments
- Require authentication for admin operations (menu management, order updates)

## Troubleshooting

### "Table does not exist" error

If you see this error, it means the setup script hasn't been run yet. Follow Step 1 above.

### "No data found" error

If the tables exist but you see no menu items, run the seed data script (Step 2 above).

### Permission errors

Make sure Row Level Security policies are properly set up by re-running the setup script.
