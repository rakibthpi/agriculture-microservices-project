# System Architecture

Detailed documentation of the Agriculture Product Marketplace microservice architecture.

---

## Architecture Principles

| Principle                  | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| **Microservices**          | Each service is independently deployable             |
| **Database per Service**   | No shared databases, no cross-service joins          |
| **API Gateway**            | Single entry point for all client requests           |
| **REST Communication**     | Services communicate via HTTP REST APIs              |
| **Separation of Concerns** | Backend handles logic, frontend handles presentation |

---

## Service Boundaries

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                     │
│                           (Next.js App)                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Public    │  │  Customer   │  │   Product   │  │    Admin    │     │
│  │   Pages     │  │  Dashboard  │  │   Manager   │  │  Dashboard  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                    │
│                                                                          │
│  • Request Routing          • Authentication Forwarding                  │
│  • Rate Limiting            • Request/Response Logging                   │
│  • CORS Handling            • Error Standardization                      │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              ▼                     ▼                     ▼
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│    AUTH SERVICE    │ │  PRODUCT SERVICE   │ │   ORDER SERVICE    │
│                    │ │                    │ │                    │
│ • User Registration│ │ • Category CRUD    │ │ • Order Placement  │
│ • User Login       │ │ • Product CRUD     │ │ • Order Status     │
│ • JWT Issuance     │ │ • Search & Filter  │ │ • Order History    │
│ • Role Management  │ │ • Inventory        │ │ • Order Analytics  │
│ • Profile Mgmt     │ │ • Pagination       │ │                    │
└────────────────────┘ └────────────────────┘ └────────────────────┘
          │                       │                       │
          ▼                       ▼                       ▼
┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐
│     AUTH DB        │ │    PRODUCT DB      │ │     ORDER DB       │
│   (PostgreSQL)     │ │   (PostgreSQL)     │ │   (PostgreSQL)     │
│                    │ │                    │ │                    │
│ • users            │ │ • categories       │ │ • orders           │
│                    │ │ • products         │ │ • order_items      │
└────────────────────┘ └────────────────────┘ └────────────────────┘
```

---

## Data Flow

### 1. User Authentication Flow

```
User → Frontend → Gateway → Auth Service → Auth DB
                     ↓
              JWT Token returned
                     ↓
       Token stored in Frontend (Cookie/LocalStorage)
```

### 2. Product Browsing Flow

```
User → Frontend → Gateway → Product Service → Product DB
                     ↓
            Product list returned
                     ↓
         Rendered in Frontend catalog
```

### 3. Order Placement Flow

```
User → Frontend → Gateway → Order Service → Order DB
                     ↓
          [Validates user via Auth Service]
          [Fetches product info via Product Service]
                     ↓
            Order confirmation returned
```

---

## Service Communication

| From          | To              | Purpose                     | Method          |
| ------------- | --------------- | --------------------------- | --------------- |
| Gateway       | Auth Service    | Validate JWT, get user info | REST            |
| Gateway       | Product Service | Proxy product requests      | REST            |
| Gateway       | Order Service   | Proxy order requests        | REST            |
| Order Service | Product Service | Validate products exist     | REST (Internal) |
| Order Service | Auth Service    | Validate user exists        | REST (Internal) |

### Internal vs External APIs

| Type         | Description         | Authentication                  |
| ------------ | ------------------- | ------------------------------- |
| **External** | Exposed via Gateway | JWT required                    |
| **Internal** | Service-to-service  | Service token / trusted network |

---

## Database Design

### Auth Database

```sql
┌─────────────────────────────────────┐
│              users                   │
├─────────────────────────────────────┤
│ id          UUID PRIMARY KEY        │
│ email       VARCHAR(255) UNIQUE     │
│ password    VARCHAR(255)            │
│ name        VARCHAR(255)            │
│ phone       VARCHAR(20)             │
│ role        ENUM(super_admin,       │
│             admin, product_manager, │
│             user)                   │
│ is_active   BOOLEAN                 │
│ created_at  TIMESTAMP               │
│ updated_at  TIMESTAMP               │
└─────────────────────────────────────┘
```

### Product Database

```sql
┌─────────────────────────────────────┐
│            categories               │
├─────────────────────────────────────┤
│ id          UUID PRIMARY KEY        │
│ name        VARCHAR(255)            │
│ description TEXT                    │
│ image_url   VARCHAR(500)            │
│ is_active   BOOLEAN                 │
│ created_at  TIMESTAMP               │
└─────────────────────────────────────┘
            │
            │ 1:N
            ▼
┌─────────────────────────────────────┐
│             products                │
├─────────────────────────────────────┤
│ id          UUID PRIMARY KEY        │
│ name        VARCHAR(255)            │
│ description TEXT                    │
│ price       DECIMAL(10,2)           │
│ stock       INTEGER                 │
│ unit        VARCHAR(50)             │
│ image_url   VARCHAR(500)            │
│ category_id UUID FOREIGN KEY        │
│ is_active   BOOLEAN                 │
│ created_at  TIMESTAMP               │
│ updated_at  TIMESTAMP               │
└─────────────────────────────────────┘
```

### Order Database

```sql
┌─────────────────────────────────────┐
│              orders                 │
├─────────────────────────────────────┤
│ id            UUID PRIMARY KEY      │
│ user_id       UUID                  │
│ status        ENUM(pending,         │
│               confirmed, shipped,   │
│               delivered, cancelled) │
│ total_amount  DECIMAL(10,2)         │
│ shipping_addr TEXT                  │
│ notes         TEXT                  │
│ created_at    TIMESTAMP             │
│ updated_at    TIMESTAMP             │
└─────────────────────────────────────┘
            │
            │ 1:N
            ▼
┌─────────────────────────────────────┐
│           order_items               │
├─────────────────────────────────────┤
│ id          UUID PRIMARY KEY        │
│ order_id    UUID FOREIGN KEY        │
│ product_id  UUID                    │
│ product_name VARCHAR(255)           │
│ quantity    INTEGER                 │
│ unit_price  DECIMAL(10,2)           │
│ total_price DECIMAL(10,2)           │
└─────────────────────────────────────┘
```

---

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Auth Service validates and issues JWT
3. JWT contains: user_id, role, expiration
4. Client sends JWT in Authorization header
5. Gateway validates JWT on each request
6. Role-based access control enforced
```

### Security Measures

| Measure          | Implementation                 |
| ---------------- | ------------------------------ |
| Password Storage | bcrypt hashing (10+ rounds)    |
| Token Security   | JWT with RS256/HS256           |
| Transport        | HTTPS in production            |
| API Protection   | Rate limiting, CORS            |
| Input Validation | DTO validation in each service |

---

## Port Configuration

| Service         | Development Port | Description           |
| --------------- | ---------------- | --------------------- |
| Frontend        | 3000             | Next.js application   |
| API Gateway     | 4000             | Request routing       |
| Auth Service    | 3001             | Authentication        |
| Product Service | 3002             | Products & Categories |
| Order Service   | 3003             | Order management      |
| Auth DB         | 5432             | PostgreSQL            |
| Product DB      | 5433             | PostgreSQL            |
| Order DB        | 5434             | PostgreSQL            |

---

## Future Considerations

### Scaling Strategy

- Horizontal scaling with container replicas
- Load balancing at Gateway level
- Read replicas for databases

### Message Queue Integration

```
Future: RabbitMQ / Kafka
├── Order placed → Inventory update event
├── Order status change → Email notification event
└── Low stock → Alert event
```

### Caching Strategy

```
Future: Redis
├── Popular product searches
├── Category listings
└── User session data
```
