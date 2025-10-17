# POS Integration API Documentation

This document describes the API endpoints available for integrating with Point of Sale (POS) systems.

## Authentication

All API requests must include an API key in the `X-API-Key` header.

\`\`\`
X-API-Key: restaurant_[restaurant_id]_[secret_key]
\`\`\`

## Endpoints

### Get Orders

Retrieve orders for your restaurant.

**Endpoint:** `GET /api/pos/orders`

**Query Parameters:**
- `status` (optional): Filter by order status (`pending`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`)
- `limit` (optional): Maximum number of orders to return (default: 50)

**Response:**
\`\`\`json
{
  "orders": [
    {
      "id": "uuid",
      "restaurant_id": "uuid",
      "table_id": "uuid",
      "status": "confirmed",
      "subtotal_cents": 2500,
      "tax_cents": 250,
      "total_cents": 2750,
      "special_instructions": "No onions",
      "created_at": "2025-01-17T10:30:00Z",
      "updated_at": "2025-01-17T10:31:00Z",
      "order_items": [...],
      "tables": {...},
      "payments": [...]
    }
  ]
}
\`\`\`

### Get Single Order

Retrieve details for a specific order.

**Endpoint:** `GET /api/pos/orders/[orderId]`

**Response:**
\`\`\`json
{
  "order": {
    "id": "uuid",
    "restaurant_id": "uuid",
    "table_id": "uuid",
    "status": "confirmed",
    "order_items": [
      {
        "id": "uuid",
        "menu_item_id": "uuid",
        "quantity": 2,
        "price_cents": 1250,
        "item_name": "Burger",
        "special_instructions": "Well done"
      }
    ],
    "tables": {
      "table_number": "5"
    },
    "payments": [...]
  }
}
\`\`\`

### Update Order Status

Update the status of an order.

**Endpoint:** `PATCH /api/pos/orders/[orderId]`

**Request Body:**
\`\`\`json
{
  "status": "preparing"
}
\`\`\`

**Valid Statuses:**
- `pending` - Order created, awaiting confirmation
- `confirmed` - Order confirmed, ready to prepare
- `preparing` - Order is being prepared in kitchen
- `ready` - Order is ready for serving
- `completed` - Order has been served
- `cancelled` - Order was cancelled

**Response:**
\`\`\`json
{
  "order": {
    "id": "uuid",
    "status": "preparing",
    "updated_at": "2025-01-17T10:35:00Z"
  }
}
\`\`\`

### Get Menu

Retrieve the restaurant's menu.

**Endpoint:** `GET /api/pos/menu`

**Response:**
\`\`\`json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Appetizers",
      "display_order": 1,
      "menu_items": [
        {
          "id": "uuid",
          "name": "French Fries",
          "description": "Crispy golden fries",
          "price_cents": 500,
          "is_available": true
        }
      ]
    }
  ]
}
\`\`\`

### Update Menu Item Availability

Update whether a menu item is available.

**Endpoint:** `PATCH /api/pos/menu`

**Request Body:**
\`\`\`json
{
  "itemId": "uuid",
  "isAvailable": false
}
\`\`\`

**Response:**
\`\`\`json
{
  "item": {
    "id": "uuid",
    "name": "French Fries",
    "is_available": false,
    "updated_at": "2025-01-17T10:40:00Z"
  }
}
\`\`\`

### Register Webhook

Register a webhook URL to receive real-time order updates.

**Endpoint:** `POST /api/pos/webhook`

**Request Body:**
\`\`\`json
{
  "webhookUrl": "https://your-pos-system.com/webhook",
  "restaurantId": "uuid",
  "events": ["order.created", "order.updated", "payment.succeeded"]
}
\`\`\`

**Available Events:**
- `order.created` - New order received
- `order.updated` - Order status changed
- `payment.succeeded` - Payment completed successfully

**Response:**
\`\`\`json
{
  "message": "Webhook registered successfully",
  "webhookUrl": "https://your-pos-system.com/webhook",
  "events": ["order.created", "order.updated", "payment.succeeded"]
}
\`\`\`

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
\`\`\`json
{
  "error": "Error message description"
}
\`\`\`

## Rate Limiting

API requests are rate limited to 100 requests per minute per API key.

## Webhook Payload Format

When events occur, webhooks will receive POST requests with the following format:

\`\`\`json
{
  "event": "order.created",
  "timestamp": "2025-01-17T10:30:00Z",
  "data": {
    "order": {...}
  }
}
\`\`\`

## Testing

You can test the API using curl:

\`\`\`bash
curl -X GET https://your-domain.com/api/pos/orders \
  -H "X-API-Key: restaurant_[id]_[secret]"
