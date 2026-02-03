# Database Schema & Migrations

Complete database documentation for the Agriculture Product Marketplace.

---

## Database Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATABASE PER SERVICE                              │
│                                                                           │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐        │
│  │   AUTH_DB       │   │  PRODUCT_DB     │   │   ORDER_DB      │        │
│  │   Port: 5432    │   │   Port: 5433    │   │   Port: 5434    │        │
│  │                 │   │                 │   │                 │        │
│  │  ┌───────────┐  │   │  ┌───────────┐  │   │  ┌───────────┐  │        │
│  │  │  users    │  │   │  │categories │  │   │  │  orders   │  │        │
│  │  └───────────┘  │   │  └───────────┘  │   │  └───────────┘  │        │
│  │                 │   │        │        │   │        │        │        │
│  │                 │   │        ▼        │   │        ▼        │        │
│  │                 │   │  ┌───────────┐  │   │  ┌───────────┐  │        │
│  │                 │   │  │ products  │  │   │  │order_items│  │        │
│  │                 │   │  └───────────┘  │   │  └───────────┘  │        │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘        │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              AUTH_DB                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  USERS                                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ id (PK)        │ UUID          │ Primary Key                     │   │
│  │ email          │ VARCHAR(255)  │ Unique, Not Null                │   │
│  │ password       │ VARCHAR(255)  │ Hashed, Not Null                │   │
│  │ name           │ VARCHAR(255)  │ Not Null                        │   │
│  │ phone          │ VARCHAR(20)   │ Nullable                        │   │
│  │ avatar_url     │ VARCHAR(500)  │ Nullable                        │   │
│  │ role           │ ENUM          │ super_admin, admin, pm, user    │   │
│  │ is_active      │ BOOLEAN       │ Default: true                   │   │
│  │ email_verified │ BOOLEAN       │ Default: false                  │   │
│  │ last_login     │ TIMESTAMP     │ Nullable                        │   │
│  │ created_at     │ TIMESTAMP     │ Default: NOW()                  │   │
│  │ updated_at     │ TIMESTAMP     │ Default: NOW()                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                            PRODUCT_DB                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  CATEGORIES                          PRODUCTS                            │
│  ┌─────────────────────────┐        ┌─────────────────────────────────┐ │
│  │ id (PK)     │ UUID      │───────▶│ id (PK)        │ UUID           │ │
│  │ name        │ VARCHAR   │   1:N  │ name           │ VARCHAR(255)   │ │
│  │ slug        │ VARCHAR   │        │ slug           │ VARCHAR(255)   │ │
│  │ description │ TEXT      │        │ description    │ TEXT           │ │
│  │ image_url   │ VARCHAR   │        │ price          │ DECIMAL(10,2)  │ │
│  │ is_active   │ BOOLEAN   │        │ compare_price  │ DECIMAL(10,2)  │ │
│  │ order       │ INTEGER   │        │ stock          │ INTEGER        │ │
│  │ created_at  │ TIMESTAMP │        │ unit           │ VARCHAR(50)    │ │
│  │ updated_at  │ TIMESTAMP │        │ sku            │ VARCHAR(100)   │ │
│  └─────────────────────────┘        │ image_url      │ VARCHAR(500)   │ │
│                                     │ images         │ JSONB          │ │
│                                     │ category_id(FK)│ UUID           │ │
│                                     │ is_active      │ BOOLEAN        │ │
│                                     │ is_featured    │ BOOLEAN        │ │
│                                     │ created_at     │ TIMESTAMP      │ │
│                                     │ updated_at     │ TIMESTAMP      │ │
│                                     └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                             ORDER_DB                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ORDERS                              ORDER_ITEMS                         │
│  ┌─────────────────────────┐        ┌─────────────────────────────────┐ │
│  │ id (PK)     │ UUID      │───────▶│ id (PK)        │ UUID           │ │
│  │ order_number│ VARCHAR   │   1:N  │ order_id (FK)  │ UUID           │ │
│  │ user_id     │ UUID      │        │ product_id     │ UUID           │ │
│  │ status      │ ENUM      │        │ product_name   │ VARCHAR(255)   │ │
│  │ subtotal    │ DECIMAL   │        │ product_image  │ VARCHAR(500)   │ │
│  │ shipping    │ DECIMAL   │        │ quantity       │ INTEGER        │ │
│  │ total_amount│ DECIMAL   │        │ unit           │ VARCHAR(50)    │ │
│  │ ship_address│ JSONB     │        │ unit_price     │ DECIMAL(10,2)  │ │
│  │ notes       │ TEXT      │        │ total_price    │ DECIMAL(10,2)  │ │
│  │ created_at  │ TIMESTAMP │        │ created_at     │ TIMESTAMP      │ │
│  │ updated_at  │ TIMESTAMP │        └─────────────────────────────────┘ │
│  └─────────────────────────┘                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## SQL Schemas

### Auth Database

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create role enum
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'product_manager', 'user');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Seed Super Admin
INSERT INTO users (email, password, name, role)
VALUES ('admin@agrimarket.com', '$2b$10$...hashed...', 'Super Admin', 'super_admin');
```
