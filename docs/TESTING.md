# Testing Guide

Testing strategy and guidelines for the Agriculture Product Marketplace.

---

## Testing Pyramid

```
                    ┌─────────────┐
                    │     E2E     │  ← Few, slow, high confidence
                    │   Tests     │
                   ─┴─────────────┴─
                  ┌─────────────────┐
                  │  Integration    │  ← Some, medium speed
                  │     Tests       │
                 ─┴─────────────────┴─
                ┌─────────────────────┐
                │      Unit Tests     │  ← Many, fast, isolated
                └─────────────────────┘
```

---

## Test Commands

| Command              | Scope | Description        |
| -------------------- | ----- | ------------------ |
| `npm run test`       | All   | Run all unit tests |
| `npm run test:watch` | All   | Watch mode         |
| `npm run test:cov`   | All   | With coverage      |
| `npm run test:e2e`   | All   | End-to-end tests   |

### Per Service

```bash
# Auth Service
npm run test --workspace=auth-service

# Product Service
npm run test --workspace=product-service

# Order Service
npm run test --workspace=order-service

# Frontend
npm run test --workspace=frontend
```

---

## Unit Testing

### Backend (NestJS + Jest)

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useClass: MockRepository }],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const user = { id: 'uuid', email: 'test@test.com' };
      repository.findOne.mockResolvedValue(user);

      const result = await service.findById('uuid');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
```

### Frontend (React Testing Library)

```typescript
// ProductCard.test.tsx
describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Basmati Rice',
    price: 120,
    imageUrl: '/rice.jpg',
  };

  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Basmati Rice')).toBeInTheDocument();
    expect(screen.getByText('৳120')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

---

## Integration Testing

```typescript
// auth.e2e-spec.ts
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('should register new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe('test@example.com');
        });
    });

    it('should reject duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        })
        .expect(409);
    });
  });
});
```

---

## Coverage Requirements

| Area                | Minimum Coverage |
| ------------------- | ---------------- |
| Services            | 80%              |
| Controllers         | 70%              |
| Utils/Helpers       | 90%              |
| Frontend Components | 70%              |

---

## Test Database

Use separate test database:

```env
# .env.test
DATABASE_NAME=auth_db_test
```

```bash
# Run with test env
NODE_ENV=test npm run test:e2e
```

---

## Mocking Guidelines

### External Services

Mock all external API calls in tests.

### Database

Use in-memory database or mock repositories.

### Time-sensitive Tests

Use Jest's fake timers for date/time operations.
