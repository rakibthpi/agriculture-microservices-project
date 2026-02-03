# Order Service

Order management microservice for the Agriculture Product Marketplace.

---

## Overview

Handles order placement, tracking, status updates, and order history.

```
┌──────────────────────────────────────────────────────────────┐
│                   ORDER SERVICE (:4003)                       │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │    Order      │  │    Status     │  │     Order       │  │
│  │   Placement   │  │   Management  │  │    History      │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Validation   │  │    Order      │  │   Analytics     │  │
│  │    Module     │  │    Items      │  │    (Future)     │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌────────────────────┐                  ┌────────────────────┐
│     ORDER DB       │                  │  Product Service   │
│   (PostgreSQL)     │ ←  validates →   │  (Stock check)     │
│      :5434         │                  │      :4002         │
└────────────────────┘                  └────────────────────┘
```

---

## Responsibilities

| Feature               | Description                  |
| --------------------- | ---------------------------- |
| **Order Placement**   | Create new orders with items |
| **Status Management** | Update order status          |
| **Order History**     | User's order list            |
| **Admin View**        | View/manage all orders       |
| **Validation**        | Verify product availability  |
| **Price Locking**     | Store price at order time    |

---

## Order Status Flow

```
┌──────────┐      ┌───────────┐      ┌──────────┐      ┌───────────┐
│ PENDING  │ ──→  │ CONFIRMED │ ──→  │ SHIPPED  │ ──→  │ DELIVERED │
└──────────┘      └───────────┘      └──────────┘      └───────────┘
     │
     ▼
┌───────────┐
│ CANCELLED │
└───────────┘
```

### Status Descriptions

| Status      | Description                         | Who can set                 |
| ----------- | ----------------------------------- | --------------------------- |
| `pending`   | Order placed, awaiting confirmation | System                      |
| `confirmed` | Order confirmed, processing         | Admin                       |
| `shipped`   | Order shipped to customer           | Admin                       |
| `delivered` | Order delivered successfully        | Admin                       |
| `cancelled` | Order cancelled                     | User (pending only) / Admin |

---

## Database Schema

```sql
-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    cancelled_reason TEXT,
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

### Address Schema (JSONB)

```json
{
  "name": "John Doe",
  "phone": "+8801712345678",
  "street": "123 Main Street",
  "city": "Dhaka",
  "district": "Dhaka",
  "postalCode": "1205",
  "country": "Bangladesh"
}
```

---

## API Endpoints

### Customer Endpoints

| Method | Endpoint             | Access | Description           |
| ------ | -------------------- | ------ | --------------------- |
| POST   | `/orders`            | User   | Place new order       |
| GET    | `/orders`            | User   | Get own orders        |
| GET    | `/orders/:id`        | Owner  | Get order details     |
| POST   | `/orders/:id/cancel` | Owner  | Cancel (pending only) |

### Admin Endpoints

| Method | Endpoint             | Access | Description      |
| ------ | -------------------- | ------ | ---------------- |
| GET    | `/orders/all`        | Admin+ | List all orders  |
| GET    | `/orders/stats`      | Admin+ | Order statistics |
| PATCH  | `/orders/:id/status` | Admin+ | Update status    |
| GET    | `/health`            | Public | Health check     |

---

## Order Placement Flow

```
1. User submits order with cart items
      │
      ▼
2. Validate user is authenticated
      │
      ▼
3. For each item:
   - Verify product exists (Product Service)
   - Check stock availability
   - Get current price
      │
      ▼
4. Calculate totals
      │
      ▼
5. Create Order + Order Items
      │
      ▼
6. Update product stock (Product Service)
      │
      ▼
7. Return order confirmation
```

---

## Project Structure

```
apps/services/order-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── entities/
│   │   │   ├── order.entity.ts
│   │   │   └── order-item.entity.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       ├── update-status.dto.ts
│   │       └── order-query.dto.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   └── utils/
│   │       └── order-number.util.ts
│   └── database/
│       └── migrations/
├── test/
├── .env.example
├── package.json
└── README.md
```

---

## Configuration

```env
# .env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_NAME=order_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# Service
PORT=4003
NODE_ENV=development

# Internal Services
AUTH_SERVICE_URL=http://localhost:4001
PRODUCT_SERVICE_URL=http://localhost:4002

# Order Settings
ORDER_NUMBER_PREFIX=ORD
DEFAULT_SHIPPING_COST=50
```

---

## Running the Service

```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
```

---

## Request/Response Examples

### Create Order Request

```json
{
  "items": [
    {
      "productId": "uuid-1",
      "quantity": 2
    },
    {
      "productId": "uuid-2",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+8801712345678",
    "street": "123 Main Street",
    "city": "Dhaka",
    "postalCode": "1205",
    "country": "Bangladesh"
  },
  "notes": "Please call before delivery"
}
```

### Order Response

```json
{
  "id": "uuid",
  "orderNumber": "ORD-2024-0001",
  "status": "pending",
  "items": [
    {
      "productId": "uuid-1",
      "productName": "Basmati Rice",
      "quantity": 2,
      "unitPrice": 120,
      "totalPrice": 240
    }
  ],
  "subtotal": 350,
  "shippingCost": 50,
  "totalAmount": 400,
  "createdAt": "2024-01-15T10:30:00Z"
}
```
