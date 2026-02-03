# API Gateway

Central entry point for all client requests to the Agriculture Product Marketplace.

---

## Overview

The API Gateway acts as a reverse proxy, routing requests to appropriate microservices while handling cross-cutting concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                     API GATEWAY (:4000)                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Routing   │  │    Auth     │  │      Logging        │ │
│  │   Module    │  │  Middleware │  │    & Monitoring     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │    CORS     │  │    Rate     │  │       Error         │ │
│  │   Handler   │  │   Limiting  │  │      Handler        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   Auth Service        Product Service        Order Service
     (:3001)              (:3002)               (:3003)
```

---

## Responsibilities

| Concern             | Implementation                 |
| ------------------- | ------------------------------ |
| **Request Routing** | Forward to appropriate service |
| **Authentication**  | Validate JWT tokens            |
| **CORS**            | Handle cross-origin requests   |
| **Rate Limiting**   | Prevent abuse                  |
| **Logging**         | Request/response logging       |
| **Error Handling**  | Standardize error responses    |

---

## Route Configuration

| Route Pattern       | Target Service  | Authentication   |
| ------------------- | --------------- | ---------------- |
| `/api/auth/*`       | Auth Service    | Public/Protected |
| `/api/categories/*` | Product Service | Public/Protected |
| `/api/products/*`   | Product Service | Public/Protected |
| `/api/orders/*`     | Order Service   | Protected        |
| `/health`           | Self            | Public           |

---

## Project Structure

```
apps/api-gateway/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Health check
│   ├── config/
│   │   └── configuration.ts    # Environment config
│   ├── common/
│   │   ├── guards/
│   │   │   └── jwt.guard.ts    # JWT validation
│   │   ├── interceptors/
│   │   │   └── logging.interceptor.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── auth/
│   │   └── auth.module.ts      # Auth proxy
│   ├── products/
│   │   └── products.module.ts  # Products proxy
│   └── orders/
│       └── orders.module.ts    # Orders proxy
├── .env.example
├── package.json
└── README.md
```

---

## Configuration

```env
# .env
PORT=4000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

## Running the Service

```bash
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

## Key Features

### 1. Request Proxying

Routes requests to microservices without modifying payloads.

### 2. JWT Validation

Validates tokens for protected routes before forwarding.

### 3. Error Standardization

Converts all errors to consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}
```

### 4. Correlation IDs

Adds unique ID to each request for distributed tracing.
