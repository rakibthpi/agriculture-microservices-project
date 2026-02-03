# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Fixed

- Resolved `EACCES` port conflict on Windows by migrating default ports:
  - Auth Service: 3001 → 4001
  - Product Service: 3002 → 4002
  - Order Service: 3003 → 4003
  - Frontend: 3000 → 4005
- Fixed systemic TypeScript `strictPropertyInitialization` errors in entities and DTOs.
- Resolved build failures due to missing `@nestjs/mapped-types` dependency.

### Added

- Comprehensive ESLint and Prettier configuration across the monorepo.
- Troubleshooting guide for common Windows development issues in `README.md`.
- System dependency and port mapping diagrams in `README.md`.

### Added

- Project documentation structure
- System architecture design
- User roles and permissions matrix
- API endpoint documentation
- Database schema design
- Docker Compose configuration
- Environment variable templates
- Contributing guidelines
- Testing strategy documentation

### Planned

- Auth Service implementation
- Product Service implementation
- Order Service implementation
- API Gateway implementation
- Next.js Frontend implementation

---

## [0.1.0] - 2026-02-03

### Added

- Initial project setup
- Documentation framework
  - README.md (Project Overview)
  - ARCHITECTURE.md (System Design)
  - ROLES.md (User Permissions)
  - API.md (Endpoint Documentation)
  - DATABASE.md (Schema Design)
  - DEPLOYMENT.md (Setup Guide)
  - TESTING.md (Test Strategy)
  - CONTRIBUTING.md (Guidelines)
- docker-compose.yml for PostgreSQL databases
- Environment variable templates for all services

---

<!--
Template for future releases:

## [X.Y.Z] - YYYY-MM-DD

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Removed features

### Fixed
- Bug fixes

### Security
- Security updates
-->
