# Contributing Guide

Guidelines for contributing to the Agriculture Product Marketplace.

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT FLOW                          │
│                                                              │
│   1. Fork/Clone  →  2. Branch  →  3. Code  →  4. Test      │
│         │              │            │           │           │
│         ▼              ▼            ▼           ▼           │
│   git clone       git checkout   npm run    npm run test   │
│                    -b feature     dev                       │
│                                                              │
│   5. Commit  →  6. Push  →  7. PR  →  8. Review  →  9. Merge│
└─────────────────────────────────────────────────────────────┘
```

---

## Branch Naming

| Type    | Pattern               | Example                  |
| ------- | --------------------- | ------------------------ |
| Feature | `feature/description` | `feature/product-search` |
| Bug Fix | `fix/description`     | `fix/login-validation`   |
| Hotfix  | `hotfix/description`  | `hotfix/order-crash`     |
| Docs    | `docs/description`    | `docs/api-update`        |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**

```bash
feat(auth): add password reset functionality
fix(product): resolve search pagination issue
docs(api): update order endpoints documentation
```

---

## Code Standards

### TypeScript

- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use meaningful variable names

### NestJS (Backend)

- One module per feature
- Use DTOs for validation
- Implement proper error handling
- Write unit tests for services

### Next.js (Frontend)

- Use functional components
- Implement proper loading states
- Handle errors gracefully
- Follow component composition patterns

---

## Pull Request Process

1. **Create PR** from your branch to `develop`
2. **Fill template** with description and changes
3. **Ensure CI passes** (lint, tests, build)
4. **Request review** from maintainers
5. **Address feedback** if any
6. **Merge** after approval

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] No console.log or debug code
- [ ] All CI checks passing

---

## Running Locally

```bash
# Clone repository
git clone <repo-url>
cd agreculture-project

# Install dependencies
npm install

# Start databases
docker-compose up -d

# Run development servers
npm run dev
```

---

## Questions?

Open an issue or contact the maintainers.
