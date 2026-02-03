# User Roles & Permissions

Complete documentation of user roles, permissions, and access control in the Agriculture Product Marketplace.

---

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                       SUPER ADMIN                            │
│                    (Full System Access)                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│         ADMIN           │     │    PRODUCT MANAGER      │
│   (User & Order Mgmt)   │     │    (Product Focus)      │
└─────────────────────────┘     └─────────────────────────┘
                              │
                              ▼
              ┌─────────────────────────────────┐
              │             USER                │
              │         (Customer)              │
              └─────────────────────────────────┘
```

---

## Role Definitions

### 🔴 Super Admin

**Description:** Full system access with ability to manage all aspects of the platform.

**Typical Users:** System owners, CTO, Lead developers

**Key Responsibilities:**

- Manage Admin and Product Manager accounts
- Configure system settings
- Access all analytics and reports
- Emergency access to all operations

---

### 🟠 Admin

**Description:** Management level access for day-to-day operations.

**Typical Users:** Operations managers, Customer support leads

**Key Responsibilities:**

- Manage customer accounts
- Handle order issues and disputes
- Manage categories
- View reports and analytics

---

### 🟡 Product Manager

**Description:** Focused access on product-related operations.

**Typical Users:** Inventory managers, Product catalog managers

**Key Responsibilities:**

- Manage product listings (CRUD)
- Update inventory and stock levels
- Manage product categories
- View product-related reports

---

### 🟢 User (Customer)

**Description:** Standard customer access for browsing and purchasing.

**Typical Users:** End customers, Buyers

**Key Responsibilities:**

- Browse and search products
- Place and track orders
- Manage own profile
- View order history

---

## Permissions Matrix

### Authentication & Profile

| Permission       | Super Admin | Admin | Product Manager | User |
| ---------------- | :---------: | :---: | :-------------: | :--: |
| Register account |      -      |   -   |        -        |  ✅  |
| Login            |     ✅      |  ✅   |       ✅        |  ✅  |
| View own profile |     ✅      |  ✅   |       ✅        |  ✅  |
| Edit own profile |     ✅      |  ✅   |       ✅        |  ✅  |
| Change password  |     ✅      |  ✅   |       ✅        |  ✅  |

### User Management

| Permission             | Super Admin | Admin | Product Manager | User |
| ---------------------- | :---------: | :---: | :-------------: | :--: |
| View all users         |     ✅      |  ✅   |       ❌        |  ❌  |
| Create admin           |     ✅      |  ❌   |       ❌        |  ❌  |
| Create product manager |     ✅      |  ✅   |       ❌        |  ❌  |
| Edit user accounts     |     ✅      |  ✅   |       ❌        |  ❌  |
| Deactivate users       |     ✅      |  ✅   |       ❌        |  ❌  |
| Delete users           |     ✅      |  ❌   |       ❌        |  ❌  |
| Assign roles           |     ✅      |  ❌   |       ❌        |  ❌  |

### Category Management

| Permission      | Super Admin | Admin | Product Manager | User |
| --------------- | :---------: | :---: | :-------------: | :--: |
| View categories |     ✅      |  ✅   |       ✅        |  ✅  |
| Create category |     ✅      |  ✅   |       ✅        |  ❌  |
| Edit category   |     ✅      |  ✅   |       ✅        |  ❌  |
| Delete category |     ✅      |  ✅   |       ❌        |  ❌  |

### Product Management

| Permission           | Super Admin | Admin | Product Manager | User |
| -------------------- | :---------: | :---: | :-------------: | :--: |
| View all products    |     ✅      |  ✅   |       ✅        |  ✅  |
| Search products      |     ✅      |  ✅   |       ✅        |  ✅  |
| Create product       |     ✅      |  ✅   |       ✅        |  ❌  |
| Edit product         |     ✅      |  ✅   |       ✅        |  ❌  |
| Delete product       |     ✅      |  ✅   |       ✅        |  ❌  |
| Update inventory     |     ✅      |  ✅   |       ✅        |  ❌  |
| Bulk import products |     ✅      |  ✅   |       ✅        |  ❌  |

### Order Management

| Permission          | Super Admin | Admin | Product Manager | User |
| ------------------- | :---------: | :---: | :-------------: | :--: |
| Place order         |     ❌      |  ❌   |       ❌        |  ✅  |
| View own orders     |     ✅      |  ✅   |       ✅        |  ✅  |
| View all orders     |     ✅      |  ✅   |       🔸        |  ❌  |
| Update order status |     ✅      |  ✅   |       ❌        |  ❌  |
| Cancel order        |     ✅      |  ✅   |       ❌        |  🔸  |
| Delete order        |     ✅      |  ❌   |       ❌        |  ❌  |
| Process refunds     |     ✅      |  ✅   |       ❌        |  ❌  |

> 🔸 = Conditional access (e.g., User can only cancel own pending orders, Product Manager can view orders containing their products)

### System Administration

| Permission             | Super Admin | Admin | Product Manager | User |
| ---------------------- | :---------: | :---: | :-------------: | :--: |
| Access admin dashboard |     ✅      |  ✅   |       ✅        |  ❌  |
| View analytics         |     ✅      |  ✅   |       🔸        |  ❌  |
| System settings        |     ✅      |  ❌   |       ❌        |  ❌  |
| View audit logs        |     ✅      |  ✅   |       ❌        |  ❌  |
| Manage API keys        |     ✅      |  ❌   |       ❌        |  ❌  |

---

## Access Control Implementation

### JWT Token Structure

```json
{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1699999999,
  "exp": 1700003599
}
```

### Role Guard (NestJS)

```typescript
// Usage in controllers
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Get('users')
getAllUsers() {
  // Only admin and super_admin can access
}
```

### Frontend Route Protection

```typescript
// Protected routes by role
const routes = {
  "/admin/*": ["super_admin", "admin"],
  "/products/manage/*": ["super_admin", "admin", "product_manager"],
  "/orders/*": ["user"],
  "/dashboard": ["super_admin", "admin", "product_manager"],
};
```

---

## Role Assignment Workflow

### New User Registration

```
1. User registers → Assigned 'user' role by default
2. Account activated immediately
3. Can browse and place orders
```

### Staff Account Creation

```
1. Super Admin creates account
2. Assigns role (admin / product_manager)
3. System sends welcome email with credentials
4. Staff can login and access their dashboard
```

### Role Upgrade Process

```
1. Super Admin reviews request
2. Updates user role in system
3. User's JWT refreshed on next login
4. New permissions take effect
```

---

## Dashboard Access by Role

| Dashboard Section   | Super Admin | Admin | Product Manager | User |
| ------------------- | :---------: | :---: | :-------------: | :--: |
| Home/Overview       |     ✅      |  ✅   |       ✅        |  ✅  |
| Analytics           |     ✅      |  ✅   |       ✅        |  ❌  |
| User Management     |     ✅      |  ✅   |       ❌        |  ❌  |
| Product Management  |     ✅      |  ✅   |       ✅        |  ❌  |
| Category Management |     ✅      |  ✅   |       ✅        |  ❌  |
| Order Management    |     ✅      |  ✅   |       🔸        |  ❌  |
| My Orders           |      -      |   -   |        -        |  ✅  |
| System Settings     |     ✅      |  ❌   |       ❌        |  ❌  |
| My Profile          |     ✅      |  ✅   |       ✅        |  ✅  |

---

## Security Considerations

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- At least one special character

### Session Security

- JWT expires after 24 hours
- Refresh token valid for 7 days
- Force logout on password change
- Single session per device (optional)

### Account Protection

- Account lockout after 5 failed attempts
- Email verification for new accounts
- Two-factor authentication (future)
