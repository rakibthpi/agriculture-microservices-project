# API Documentation

Complete REST API documentation for the Agriculture Product Marketplace.

---

## Base URLs

| Environment | URL                            |
| ----------- | ------------------------------ |
| Development | `http://localhost:4000/api`    |
| Production  | `https://api.yoursite.com/api` |

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Auth Service Endpoints

### POST `/api/auth/register`

Register a new user account.

**Access:** Public

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+8801712345678"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "message": "Registration successful"
}
```

---

### POST `/api/auth/login`

Authenticate user and receive JWT token.

**Access:** Public

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

### GET `/api/auth/profile`

Get current user profile.

**Access:** Authenticated users

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+8801712345678",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT `/api/auth/profile`

Update current user profile.

**Access:** Authenticated users

**Request Body:**

```json
{
  "name": "John Updated",
  "phone": "+8801787654321"
}
```

---

### POST `/api/auth/refresh`

Refresh access token.

**Access:** Public (with valid refresh token)

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### GET `/api/auth/users`

List all users (with pagination).

**Access:** Super Admin, Admin

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| role | string | - | Filter by role |
| search | string | - | Search by name/email |

---

### PUT `/api/auth/users/:id/role`

Update user role.

**Access:** Super Admin only

**Request Body:**

```json
{
  "role": "admin"
}
```

---

## Product Service Endpoints

### Categories

#### GET `/api/categories`

List all categories.

**Access:** Public

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Rice",
      "description": "All types of rice",
      "imageUrl": "https://...",
      "productCount": 25
    }
  ]
}
```

---

#### POST `/api/categories`

Create a new category.

**Access:** Super Admin, Admin, Product Manager

**Request Body:**

```json
{
  "name": "Spices",
  "description": "Fresh and dried spices",
  "imageUrl": "https://..."
}
```

---

#### PUT `/api/categories/:id`

Update a category.

**Access:** Super Admin, Admin, Product Manager

---

#### DELETE `/api/categories/:id`

Delete a category.

**Access:** Super Admin, Admin

---

### Products

#### GET `/api/products`

List products with pagination.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 12 | Items per page |
| category | string | - | Filter by category ID |
| minPrice | number | - | Minimum price |
| maxPrice | number | - | Maximum price |
| inStock | boolean | - | Only show in-stock items |
| sort | string | createdAt | Sort field |
| order | string | desc | Sort order (asc/desc) |

---

#### GET `/api/products/search`

Search products with filters.

**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (name, description) |
| category | string | Category ID |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |

**Example:**

```
GET /api/products/search?q=basmati&minPrice=50&maxPrice=200
```

**Success Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Basmati Rice Premium",
      "description": "Long grain aromatic rice",
      "price": 120.0,
      "unit": "kg",
      "stock": 500,
      "imageUrl": "https://...",
      "category": {
        "id": "uuid",
        "name": "Rice"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 5
  }
}
```

---

#### GET `/api/products/:id`

Get product details.

**Access:** Public

---

#### POST `/api/products`

Create a new product.

**Access:** Super Admin, Admin, Product Manager

**Request Body:**

```json
{
  "name": "Organic Turmeric Powder",
  "description": "100% pure organic turmeric",
  "price": 85.0,
  "unit": "g",
  "stock": 200,
  "categoryId": "uuid",
  "imageUrl": "https://..."
}
```

---

#### PUT `/api/products/:id`

Update a product.

**Access:** Super Admin, Admin, Product Manager

---

#### PATCH `/api/products/:id/stock`

Update product stock.

**Access:** Super Admin, Admin, Product Manager

**Request Body:**

```json
{
  "stock": 150,
  "operation": "set" // or "add" or "subtract"
}
```

---

#### DELETE `/api/products/:id`

Delete a product.

**Access:** Super Admin, Admin, Product Manager

---

## Order Service Endpoints

#### POST `/api/orders`

Place a new order.

**Access:** Authenticated users (User role)

**Request Body:**

```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    },
    {
      "productId": "uuid",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Dhaka",
    "postalCode": "1205",
    "country": "Bangladesh"
  },
  "notes": "Please pack carefully"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2024-0001",
    "status": "pending",
    "items": [...],
    "totalAmount": 450.00,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Order placed successfully"
}
```

---

#### GET `/api/orders`

Get current user's orders.

**Access:** Authenticated users

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | - | Filter by status |

---

#### GET `/api/orders/:id`

Get order details.

**Access:** Order owner, Admin, Super Admin

---

#### GET `/api/orders/all`

Get all orders (admin view).

**Access:** Super Admin, Admin

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | Filter by status |
| userId | string | Filter by user ID |
| from | date | Start date |
| to | date | End date |

---

#### PATCH `/api/orders/:id/status`

Update order status.

**Access:** Super Admin, Admin

**Request Body:**

```json
{
  "status": "confirmed",
  "note": "Order confirmed and being processed"
}
```

**Valid Status Transitions:**
| From | To |
|------|----|
| pending | confirmed, cancelled |
| confirmed | shipped, cancelled |
| shipped | delivered |
| delivered | - (final) |
| cancelled | - (final) |

---

#### POST `/api/orders/:id/cancel`

Cancel an order.

**Access:** Order owner (pending only), Admin, Super Admin

---

## Error Codes

| Code                     | HTTP Status | Description               |
| ------------------------ | ----------- | ------------------------- |
| AUTH_INVALID_CREDENTIALS | 401         | Invalid email or password |
| AUTH_TOKEN_EXPIRED       | 401         | JWT token has expired     |
| AUTH_UNAUTHORIZED        | 403         | Insufficient permissions  |
| USER_NOT_FOUND           | 404         | User does not exist       |
| USER_EMAIL_EXISTS        | 409         | Email already registered  |
| PRODUCT_NOT_FOUND        | 404         | Product does not exist    |
| PRODUCT_OUT_OF_STOCK     | 400         | Insufficient stock        |
| CATEGORY_NOT_FOUND       | 404         | Category does not exist   |
| ORDER_NOT_FOUND          | 404         | Order does not exist      |
| ORDER_INVALID_STATUS     | 400         | Invalid status transition |
| VALIDATION_ERROR         | 400         | Request validation failed |
| INTERNAL_ERROR           | 500         | Internal server error     |

---

## Rate Limiting

| Endpoint Type           | Limit               |
| ----------------------- | ------------------- |
| Public endpoints        | 100 requests/minute |
| Authenticated endpoints | 300 requests/minute |
| Admin endpoints         | 500 requests/minute |

---

## Webhooks (Future)

| Event                | Description                   |
| -------------------- | ----------------------------- |
| order.created        | New order placed              |
| order.status.changed | Order status updated          |
| product.low_stock    | Product stock below threshold |
