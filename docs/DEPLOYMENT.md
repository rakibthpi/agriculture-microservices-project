# Deployment Guide

Step-by-step guide for deploying the Agriculture Product Marketplace.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Production Deployment](#production-deployment)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software       | Version | Purpose          |
| -------------- | ------- | ---------------- |
| Node.js        | 18+     | Runtime          |
| npm            | 9+      | Package manager  |
| Docker         | 20+     | Containerization |
| Docker Compose | 2+      | Multi-container  |
| PostgreSQL     | 14+     | Database         |
| Git            | Latest  | Version control  |

### System Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| CPU      | 2 cores | 4 cores     |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 20 GB   | 50 GB       |

---

## Local Development Setup

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd agreculture-project
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Databases

```bash
docker-compose up -d postgres-auth postgres-product postgres-order
```

### Step 4: Configure Environment

```bash
# Copy environment files
cp apps/services/auth-service/.env.example apps/services/auth-service/.env
cp apps/services/product-service/.env.example apps/services/product-service/.env
cp apps/services/order-service/.env.example apps/services/order-service/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

### Step 5: Run Migrations

```bash
npm run db:migrate --workspace=auth-service
npm run db:migrate --workspace=product-service
npm run db:migrate --workspace=order-service
```

### Step 6: Seed Initial Data (Optional)

```bash
npm run db:seed --workspace=auth-service
npm run db:seed --workspace=product-service
```

### Step 7: Start Development Servers

```bash
# Terminal 1 - Auth Service
npm run dev --workspace=auth-service

# Terminal 2 - Product Service
npm run dev --workspace=product-service

# Terminal 3 - Order Service
npm run dev --workspace=order-service

# Terminal 4 - API Gateway
npm run dev --workspace=api-gateway

# Terminal 5 - Frontend
npm run dev --workspace=frontend
```

### Alternative: Start All Services

```bash
npm run dev
```

### Step 8: Verify Setup

| Service         | URL                          | Expected          |
| --------------- | ---------------------------- | ----------------- |
| Frontend        | http://localhost:4005        | Homepage          |
| API Gateway     | http://localhost:4000/health | `{"status":"ok"}` |
| Auth Service    | http://localhost:4001/health | `{"status":"ok"}` |
| Product Service | http://localhost:4002/health | `{"status":"ok"}` |
| Order Service   | http://localhost:4003/health | `{"status":"ok"}` |

---

## Docker Deployment

### Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Docker Compose Services

```yaml
# docker-compose.yml structure
services:
  # Databases
  postgres-auth:
    image: postgres:14-alpine
    ports: ['5432:5432']

  postgres-product:
    image: postgres:14-alpine
    ports: ['5433:5432']

  postgres-order:
    image: postgres:14-alpine
    ports: ['5434:5432']

  # Services
  auth-service:
    build: ./apps/services/auth-service
    ports: ['4001:4001']

  product-service:
    build: ./apps/services/product-service
    ports: ['4002:4002']

  order-service:
    build: ./apps/services/order-service
    ports: ['4003:4003']

  api-gateway:
    build: ./apps/api-gateway
    ports: ['4000:4000']

  frontend:
    build: ./apps/frontend
    ports: ['4005:4005']
```

---

## Production Deployment

### Architecture Overview

```
                   ┌─────────────────┐
                   │   Load Balancer │
                   │   (nginx/ALB)   │
                   └────────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Frontend    │  │   Frontend    │  │   Frontend    │
│   Replica 1   │  │   Replica 2   │  │   Replica 3   │
└───────────────┘  └───────────────┘  └───────────────┘
                            │
                   ┌────────┴────────┐
                   │   API Gateway   │
                   │   (Replicas)    │
                   └────────┬────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
    ▼                       ▼                       ▼
┌─────────┐           ┌─────────┐           ┌─────────┐
│  Auth   │           │ Product │           │  Order  │
│ Service │           │ Service │           │ Service │
└────┬────┘           └────┬────┘           └────┬────┘
     │                     │                     │
     ▼                     ▼                     ▼
┌─────────┐           ┌─────────┐           ┌─────────┐
│ Auth DB │           │Prod. DB │           │Order DB │
│(Primary)│           │(Primary)│           │(Primary)│
└────┬────┘           └────┬────┘           └────┬────┘
     │                     │                     │
     ▼                     ▼                     ▼
┌─────────┐           ┌─────────┐           ┌─────────┐
│ Replica │           │ Replica │           │ Replica │
└─────────┘           └─────────┘           └─────────┘
```

### Production Checklist

#### Security

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured (not in code)
- [ ] JWT secrets rotated and secured
- [ ] Database credentials secured
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Security headers configured

#### Performance

- [ ] Frontend build optimized (`npm run build`)
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Gzip compression enabled
- [ ] CDN configured for static assets

#### Monitoring

- [ ] Health check endpoints active
- [ ] Logging configured (structured JSON)
- [ ] Error tracking service connected
- [ ] Performance monitoring enabled
- [ ] Database monitoring configured

#### Backup

- [ ] Automated database backups scheduled
- [ ] Backup restoration tested
- [ ] Point-in-time recovery enabled

---

## Environment Variables

### Auth Service

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=auth_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Service
PORT=4001
NODE_ENV=development
```

### Product Service

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5433
DATABASE_NAME=product_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Service
PORT=4002
NODE_ENV=development

# Internal Services
AUTH_SERVICE_URL=http://localhost:4001
```

### Order Service

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_NAME=order_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Service
PORT=4003
NODE_ENV=development

# Internal Services
AUTH_SERVICE_URL=http://localhost:4001
PRODUCT_SERVICE_URL=http://localhost:4002
```

### API Gateway

```env
PORT=4000
NODE_ENV=development

# Service URLs
AUTH_SERVICE_URL=http://localhost:4001
PRODUCT_SERVICE_URL=http://localhost:4002
ORDER_SERVICE_URL=http://localhost:4003

# CORS
ALLOWED_ORIGINS=http://localhost:4005
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_APP_NAME="Agriculture Marketplace"
```

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

1. Check if PostgreSQL is running: `docker ps`
2. Verify port is correct in `.env`
3. Check container logs: `docker-compose logs postgres-auth`

---

#### Service Cannot Find Other Services

```
Error: ECONNREFUSED http://localhost:3001
```

**Solution:**

1. Start services in correct order (databases first)
2. Verify service URLs in environment files
3. Check if all services are running

---

#### Windows Port Exclusion (EACCES)

```
Error: listen EACCES: permission denied 0.0.0.0:3001
```

**Solution:**

Windows often reserves ports in the `3000` range for system services.

1. Check reserved ranges: `netsh int ipv4 show excludedportrange protocol=tcp`
2. Move services to the `4000+` range (as configured by default in this project now).

#### JWT Token Invalid

```
Error: Invalid or expired token
```

**Solution:**

1. Clear browser cookies/storage
2. Re-login to get new token
3. Verify JWT_SECRET matches across services

---

#### Port Already in Use

```
Error: EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <pid> /F

# Or change port in .env
```

---

### Logs Location

| Service | Log Command                           |
| ------- | ------------------------------------- |
| Auth    | `docker-compose logs auth-service`    |
| Product | `docker-compose logs product-service` |
| Order   | `docker-compose logs order-service`   |
| Gateway | `docker-compose logs api-gateway`     |
| All     | `docker-compose logs`                 |

---

## Health Checks

```bash
# Check all services
curl http://localhost:4000/health
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health

# Expected response
{"status":"ok","timestamp":"2024-01-15T10:00:00Z"}
```
