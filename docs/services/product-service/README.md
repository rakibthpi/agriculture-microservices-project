# Product Service

Product and Category management microservice for the Agriculture Product Marketplace.

---

## Overview

Manages the product catalog including categories, products, search, and inventory.

```
┌──────────────────────────────────────────────────────────────┐
│                  PRODUCT SERVICE (:3002)                      │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │   Category    │  │    Product    │  │     Search      │  │
│  │   Management  │  │   Management  │  │     Engine      │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │   Inventory   │  │  Pagination   │  │     Filters     │  │
│  │   Tracking    │  │    Module     │  │     Module      │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌────────────────────┐
                  │    PRODUCT DB      │
                  │   (PostgreSQL)     │
                  │      :5433         │
                  └────────────────────┘
```

---

## Responsibilities

| Feature           | Description                             |
| ----------------- | --------------------------------------- |
| **Category CRUD** | Create, read, update, delete categories |
| **Product CRUD**  | Full product lifecycle management       |
| **Search**        | Text search with PostgreSQL ILIKE       |
| **Filters**       | Price range, category, availability     |
| **Pagination**    | Efficient large dataset handling        |
| **Inventory**     | Stock level management                  |

---

## Database Schema

```sql
-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(500),
    images JSONB DEFAULT '[]',
    category_id UUID REFERENCES categories(id),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for search optimization
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active);
```

---

## API Endpoints

### Categories

| Method | Endpoint          | Access | Description         |
| ------ | ----------------- | ------ | ------------------- |
| GET    | `/categories`     | Public | List all categories |
| GET    | `/categories/:id` | Public | Get category by ID  |
| POST   | `/categories`     | PM+    | Create category     |
| PUT    | `/categories/:id` | PM+    | Update category     |
| DELETE | `/categories/:id` | Admin+ | Delete category     |

### Products

| Method | Endpoint              | Access | Description               |
| ------ | --------------------- | ------ | ------------------------- |
| GET    | `/products`           | Public | List products (paginated) |
| GET    | `/products/search`    | Public | Search with filters       |
| GET    | `/products/featured`  | Public | Get featured products     |
| GET    | `/products/:id`       | Public | Get product by ID         |
| POST   | `/products`           | PM+    | Create product            |
| PUT    | `/products/:id`       | PM+    | Update product            |
| PATCH  | `/products/:id/stock` | PM+    | Update stock              |
| DELETE | `/products/:id`       | PM+    | Delete product            |
| GET    | `/health`             | Public | Health check              |

---

## Search & Filter Parameters

| Parameter  | Type    | Example   | Description         |
| ---------- | ------- | --------- | ------------------- |
| `q`        | string  | `rice`    | Search query        |
| `category` | uuid    | `abc-123` | Filter by category  |
| `minPrice` | number  | `50`      | Minimum price       |
| `maxPrice` | number  | `500`     | Maximum price       |
| `inStock`  | boolean | `true`    | Only in-stock items |
| `sort`     | string  | `price`   | Sort field          |
| `order`    | string  | `asc`     | Sort order          |
| `page`     | number  | `1`       | Page number         |
| `limit`    | number  | `12`      | Items per page      |

### Example Search

```
GET /products/search?q=basmati&minPrice=100&maxPrice=300&sort=price&order=asc
```

---

## Project Structure

```
apps/services/product-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── categories/
│   │   ├── categories.module.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts
│   │   ├── entities/
│   │   │   └── category.entity.ts
│   │   └── dto/
│   │       ├── create-category.dto.ts
│   │       └── update-category.dto.ts
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── entities/
│   │   │   └── product.entity.ts
│   │   └── dto/
│   │       ├── create-product.dto.ts
│   │       ├── update-product.dto.ts
│   │       └── search-product.dto.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   └── pipes/
│   └── database/
│       ├── migrations/
│       └── seeds/
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
DATABASE_PORT=5433
DATABASE_NAME=product_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# Service
PORT=3002
NODE_ENV=development

# Internal Services (for JWT validation)
AUTH_SERVICE_URL=http://localhost:3001

# Pagination defaults
DEFAULT_PAGE_SIZE=12
MAX_PAGE_SIZE=50
```

---

## Running the Service

```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Seed sample data
npm run seed

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

## Sample Data

### Categories

| Name             | Description            |
| ---------------- | ---------------------- |
| Rice             | All varieties of rice  |
| Spices           | Fresh and dried spices |
| Ghee & Oils      | Cooking oils and ghee  |
| Fruits           | Fresh seasonal fruits  |
| Vegetables       | Fresh vegetables       |
| Pulses & Lentils | Dals and lentils       |

### Products Example

```json
{
  "name": "Basmati Rice Premium",
  "description": "Long grain aromatic basmati rice",
  "price": 120.0,
  "unit": "kg",
  "stock": 500,
  "category": "Rice",
  "isFeatured": true
}
```
