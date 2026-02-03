# 🌾 Agriculture Product Marketplace

A scalable microservice-based platform for buying and selling agriculture products (rice, ghee, spices, fruits, vegetables, etc.).

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Contributing](#contributing)

---

## 🎯 Project Overview

### Vision

Create an online platform connecting farmers and sellers with customers, enabling seamless buying and selling of agriculture products with a focus on scalability and maintainability.

### Core Features

| Feature              | Description                                |
| -------------------- | ------------------------------------------ |
| **User Management**  | Registration, login, role-based access     |
| **Product Catalog**  | Browse products with categories            |
| **Search & Filter**  | Find products by name, price, category     |
| **Order Management** | Place orders and track status              |
| **Admin Dashboard**  | Manage products, categories, users, orders |

### Out of Scope (v1.0)

- Payment gateway integration
- Advanced analytics dashboard
- Real-time notifications
- Mobile applications

---

## 🛠 Technology Stack

| Layer                | Technology                           |
| -------------------- | ------------------------------------ |
| **Frontend**         | Next.js 14, TypeScript, Tailwind CSS |
| **Backend**          | NestJS (Microservices)               |
| **Database**         | PostgreSQL (One per service)         |
| **Authentication**   | JWT (JSON Web Tokens)                |
| **Communication**    | REST API                             |
| **Containerization** | Docker, Docker Compose               |

---

## 🏗 System Architecture

````
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                       │
│                    http://localhost:4005                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway (NestJS)                       │
│                    http://localhost:4000                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Auth Service │   │Product Service│   │ Order Service │
│  :4001        │   │  :4002        │   │  :4003        │
└───────────────┘   └───────────────┘   └───────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   Auth DB     │   │  Product DB   │   │   Order DB    │
### Service Port Mapping

| Service       | Default Port | Primary URL                  | Role               |
| ------------- | ------------ | ---------------------------- | ------------------ |
| **API Gateway** | `4000`       | `http://localhost:4000`      | Request Routing    |
| **Auth Service** | `4001`       | `http://localhost:4001/api`  | User Auth & Profile |
| **Product Service**| `4002`       | `http://localhost:4002/api`  | Category & Product |
| **Order Service**  | `4003`       | `http://localhost:4003/api`  | Orders & Items     |
| **Frontend**    | `4005`       | `http://localhost:4005`      | Client Application |

### System Dependency Graph

```mermaid
graph TD
    User([User]) --> Frontend[Frontend :4005]
    Frontend --> Gateway[API Gateway :4000]
    Gateway --> AuthService[Auth Service :4001]
    Gateway --> ProductService[Product Service :4002]
    Gateway --> OrderService[Order Service :4003]

    OrderService -- Uses --> AuthService
    OrderService -- Uses --> ProductService
    ProductService -- Uses --> AuthService

    AuthService --- AuthDB[(Auth DB)]
    ProductService --- ProductDB[(Product DB)]
    OrderService --- OrderDB[(Order DB)]
````

> 📖 See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

---

## 👥 User Roles

| Role                | Access Level | Key Permissions                                 |
| ------------------- | ------------ | ----------------------------------------------- |
| **Super Admin**     | Full System  | All permissions, manage admins, system settings |
| **Admin**           | Management   | Manage users, categories, view all orders       |
| **Product Manager** | Products     | Manage products, inventory, view orders         |
| **User (Customer)** | Customer     | Browse, search, order, view own orders          |

> 📖 See [docs/ROLES.md](docs/ROLES.md) for detailed role permissions.

---

## 📁 Project Structure

```
agreculture-project/
├── README.md                   # This file
├── docker-compose.yml          # Database containers
├── .gitignore                  # Git ignore rules
│
└── docs/                       # All Documentation
    ├── ARCHITECTURE.md         # System architecture
    ├── ROLES.md                # User roles & permissions
    ├── API.md                  # API documentation
    ├── DATABASE.md             # Database schemas & ERD
    ├── TESTING.md              # Testing strategy
    ├── DEPLOYMENT.md           # Deployment guide
    ├── CONTRIBUTING.md         # Contribution guidelines
    ├── CHANGELOG.md            # Version history
    │
    ├── env-templates/          # Environment variable templates
    │   ├── auth-service.env.example
    │   ├── product-service.env.example
    │   ├── order-service.env.example
    │   ├── api-gateway.env.example
    │   └── frontend.env.example
    │
    ├── api-gateway/            # Gateway documentation
    │   └── README.md
    ├── frontend/               # Frontend documentation
    │   └── README.md
    └── services/               # Service documentation
        ├── auth-service/
        │   └── README.md
        ├── product-service/
        │   └── README.md
        └── order-service/
            └── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd agreculture-project

# 2. Install dependencies
npm install

# 3. Start databases
docker-compose up -d

# 4. Start all services (development)
npm run dev

# 5. Open browser
# Frontend: http://localhost:4005
# API Gateway: http://localhost:4000
```

### Environment Setup

Copy `.env.example` to `.env` in each service directory and configure:

- Database credentials
- JWT secrets
- Service URLs

---

## 📚 Documentation

| Document                                | Description                          |
| --------------------------------------- | ------------------------------------ |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design and service boundaries |
| [ROLES.md](docs/ROLES.md)               | User roles and permissions matrix    |
| [API.md](docs/API.md)                   | Complete API documentation           |
| [DATABASE.md](docs/DATABASE.md)         | Database schemas and ERD diagrams    |
| [TESTING.md](docs/TESTING.md)           | Testing strategy and examples        |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md)     | Production deployment guide          |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Development guidelines               |
| [CHANGELOG.md](docs/CHANGELOG.md)       | Version history                      |

### Service Documentation

- [API Gateway](docs/api-gateway/README.md)
- [Auth Service](docs/services/auth-service/README.md)
- [Product Service](docs/services/product-service/README.md)
- [Order Service](docs/services/order-service/README.md)
- [Frontend](docs/frontend/README.md)

### Environment Templates

All `.env.example` files are in `docs/env-templates/`

---

## 🤝 Contributing

1. Follow the "Design → Document → Build" principle
2. Create feature branches from `develop`
3. Write tests for new features
4. Update documentation as needed
5. Submit pull requests for review

---

## 🔧 Troubleshooting

### Port Conflict (Windows EACCES)

If you see `Error: listen EACCES: permission denied 0.0.0.0:3001` on Windows, it's likely because the port is in a reserved range (often due to Hyper-V).

- **Solution**: We have moved services to the `4001-4005` range. Use these ports in your `.env` files.
- **Check reserved ports**: `netsh int ipv4 show excludedportrange protocol=tcp`

### TypeScript Initialization Errors

If you see `Property '...' has no initializer and is not definitely assigned in the constructor`:

- **Solution**: This is expected for TypeORM entities and NestJS DTOs. We have disabled `strictPropertyInitialization` in the root `tsconfig.base.json` to support this pattern.

---

## 📄 License

This project is licensed under the MIT License.
