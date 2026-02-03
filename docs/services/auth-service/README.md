# Auth Service

Authentication and user management microservice for the Agriculture Product Marketplace.

---

## Overview

Handles all authentication, authorization, and user management operations.

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTH SERVICE (:4001)                       │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │  Registration │  │     Login     │  │  JWT Issuance   │  │
│  │    Module     │  │    Module     │  │     Module      │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
│                                                               │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │    Profile    │  │     Role      │  │      User       │  │
│  │   Management  │  │   Management  │  │   Management    │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                  ┌────────────────────┐
                  │      AUTH DB       │
                  │   (PostgreSQL)     │
                  │      :5432         │
                  └────────────────────┘
```

---

## Responsibilities

| Feature                | Description                           |
| ---------------------- | ------------------------------------- |
| **User Registration**  | Create new user accounts              |
| **User Login**         | Authenticate and issue JWT            |
| **JWT Management**     | Token generation, refresh, validation |
| **Role Management**    | Assign and manage user roles          |
| **Profile Management** | User profile CRUD                     |
| **Password Security**  | Hashing with bcrypt                   |

---

## User Roles

| Role            | Code              | Description             |
| --------------- | ----------------- | ----------------------- |
| Super Admin     | `super_admin`     | Full system access      |
| Admin           | `admin`           | User & Order management |
| Product Manager | `product_manager` | Product management      |
| User            | `user`            | Customer (default)      |

---

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

## API Endpoints

| Method | Endpoint          | Access      | Description       |
| ------ | ----------------- | ----------- | ----------------- |
| POST   | `/auth/register`  | Public      | Register new user |
| POST   | `/auth/login`     | Public      | User login        |
| POST   | `/auth/refresh`   | Public      | Refresh token     |
| GET    | `/auth/profile`   | Auth        | Get own profile   |
| PUT    | `/auth/profile`   | Auth        | Update profile    |
| PUT    | `/auth/password`  | Auth        | Change password   |
| GET    | `/users`          | Admin+      | List all users    |
| GET    | `/users/:id`      | Admin+      | Get user by ID    |
| PUT    | `/users/:id`      | Admin+      | Update user       |
| PUT    | `/users/:id/role` | Super Admin | Change role       |
| DELETE | `/users/:id`      | Super Admin | Delete user       |
| GET    | `/health`         | Public      | Health check      |

---

## Project Structure

```
apps/services/auth-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
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
DATABASE_PORT=5432
DATABASE_NAME=auth_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Service
PORT=4001
NODE_ENV=development

# Password
BCRYPT_ROUNDS=10
```

---

## Running the Service

```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Seed initial data (creates super admin)
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

## JWT Token Structure

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1699999999,
  "exp": 1700086399
}
```

---

## Security Features

| Feature             | Implementation                |
| ------------------- | ----------------------------- |
| Password Hashing    | bcrypt (10 rounds)            |
| Token Expiry        | 24h access, 7d refresh        |
| Role Guards         | Decorator-based RBAC          |
| Password Validation | Min 8 chars, complexity rules |
| Account Lockout     | After 5 failed attempts       |
