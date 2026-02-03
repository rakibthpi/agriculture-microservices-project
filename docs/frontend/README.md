# Frontend (Next.js)

Customer and Admin web application for the Agriculture Product Marketplace.

---

## Overview

Modern, responsive web application built with Next.js App Router, serving both customers and administrators.

```
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (:3000)                            │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    PUBLIC PAGES                          │ │
│  │  ┌──────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐  │ │
│  │  │ Home │  │ Products │  │ Search │  │ Product View │  │ │
│  │  └──────┘  └──────────┘  └────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  CUSTOMER PORTAL                         │ │
│  │  ┌──────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐  │ │
│  │  │ Cart │  │ Checkout │  │ Orders │  │   Profile    │  │ │
│  │  └──────┘  └──────────┘  └────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   ADMIN DASHBOARD                         │ │
│  │  ┌───────────┐  ┌──────────┐  ┌────────┐  ┌──────────┐ │ │
│  │  │ Dashboard │  │ Products │  │ Orders │  │  Users   │ │ │
│  │  └───────────┘  └──────────┘  └────────┘  └──────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌────────────────────┐
                  │    API Gateway     │
                  │      (:4000)       │
                  └────────────────────┘
```

---

## Technology Stack

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| Next.js 14      | React framework with App Router |
| TypeScript      | Type safety                     |
| Tailwind CSS    | Styling                         |
| React Query     | Data fetching & caching         |
| Zustand         | State management                |
| React Hook Form | Form handling                   |
| Zod             | Validation                      |

---

## Page Structure

### Public Pages (No Auth Required)

| Route                | Description                     |
| -------------------- | ------------------------------- |
| `/`                  | Homepage with featured products |
| `/products`          | Product catalog with filters    |
| `/products/[id]`     | Product details page            |
| `/categories/[slug]` | Category product listing        |
| `/search`            | Search results page             |
| `/auth/login`        | User login                      |
| `/auth/register`     | User registration               |

### Customer Pages (User Auth Required)

| Route               | Description      |
| ------------------- | ---------------- |
| `/cart`             | Shopping cart    |
| `/checkout`         | Checkout process |
| `/orders`           | Order history    |
| `/orders/[id]`      | Order details    |
| `/profile`          | User profile     |
| `/profile/settings` | Account settings |

### Admin Pages (Admin/Super Admin Required)

| Route                  | Description         |
| ---------------------- | ------------------- |
| `/admin`               | Admin dashboard     |
| `/admin/products`      | Product management  |
| `/admin/products/new`  | Add new product     |
| `/admin/products/[id]` | Edit product        |
| `/admin/categories`    | Category management |
| `/admin/orders`        | Order management    |
| `/admin/users`         | User management     |
| `/admin/settings`      | System settings     |

### Product Manager Pages

| Route                | Description          |
| -------------------- | -------------------- |
| `/manager`           | PM dashboard         |
| `/manager/products`  | Product management   |
| `/manager/inventory` | Inventory management |

---

## Project Structure

```
apps/frontend/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   │
│   ├── (public)/               # Public routes group
│   │   ├── products/
│   │   │   ├── page.tsx        # Product listing
│   │   │   └── [id]/page.tsx   # Product details
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx
│   │   └── search/page.tsx
│   │
│   ├── (auth)/                 # Auth routes group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (customer)/             # Customer routes
│   │   ├── layout.tsx          # Customer layout
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── profile/page.tsx
│   │
│   └── (admin)/                # Admin routes
│       ├── layout.tsx          # Admin layout
│       ├── admin/
│       │   ├── page.tsx        # Dashboard
│       │   ├── products/
│       │   ├── categories/
│       │   ├── orders/
│       │   └── users/
│       └── manager/
│           └── products/
│
├── components/
│   ├── ui/                     # UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductFilters.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   └── admin/
│       ├── DataTable.tsx
│       └── StatsCard.tsx
│
├── lib/
│   ├── api.ts                  # API client
│   ├── auth.ts                 # Auth utilities
│   └── utils.ts                # Helper functions
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useOrders.ts
│
├── stores/
│   ├── authStore.ts            # Auth state
│   └── cartStore.ts            # Cart state
│
├── types/
│   ├── user.ts
│   ├── product.ts
│   └── order.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.example
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Configuration

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_NAME="Agriculture Marketplace"
NEXT_PUBLIC_APP_DESCRIPTION="Fresh farm products delivered to your door"
```

---

## Running the Application

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

---

## Key Features

### Customer Experience

- **Product Browsing** - Grid/list view with filters
- **Search** - Real-time search suggestions
- **Cart** - Persistent cart with localStorage
- **Checkout** - Step-by-step checkout flow
- **Order Tracking** - View order status

### Admin Features

- **Dashboard** - Sales overview, recent orders
- **Product Management** - CRUD with image upload
- **Category Management** - Organize products
- **Order Management** - View, update status
- **User Management** - View, edit, deactivate users

---

## UI Components

### Design System

| Component   | Description                          |
| ----------- | ------------------------------------ |
| `Button`    | Primary, secondary, outline variants |
| `Input`     | Text, email, password, number        |
| `Card`      | Product cards, stat cards            |
| `Modal`     | Confirmation dialogs                 |
| `Toast`     | Success/error notifications          |
| `DataTable` | Sortable, paginated tables           |

### Color Palette

```css
:root {
  --primary: #22c55e; /* Green - Agriculture theme */
  --secondary: #16a34a;
  --accent: #f59e0b; /* Orange - CTAs */
  --background: #f8fafc;
  --foreground: #1e293b;
}
```

---

## Authentication Flow

```
1. User visits protected route
      │
      ▼
2. AuthGuard checks for token
      │
      ├── No token → Redirect to /login
      │
      └── Has token → Validate with API
            │
            ├── Invalid → Clear token, redirect to /login
            │
            └── Valid → Allow access, check role permissions
```

---

## State Management

### Auth Store (Zustand)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
}
```

### Cart Store (Zustand)

```typescript
interface CartState {
  items: CartItem[];
  addItem: (product, quantity) => void;
  removeItem: (productId) => void;
  updateQuantity: (productId, quantity) => void;
  clearCart: () => void;
  total: number;
}
```
