# Inventory & Order Management API

A backend project built to learn production backend practices — not just CRUD, but the full layer stack you'd find in a real prod service: validation, layered architecture, caching, queues, error handling, logging, monitoring, graceful shutdown, security, concurrency, and testing.

Domain is intentionally simple (products, stock, orders) so the focus stays on the production concerns, not business logic.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Cache / Queue**: Redis + BullMQ
- **Testing**: Vitest + Supertest

## Project Structure

```
src/
  controllers/     # HTTP layer only — no DB access, no business logic
  services/        # business logic — no HTTP, no SQL
  repositories/     # data access only — no business rules
  routes/
  middlewares/
  db/
    schema/
  dto/
  errors/
  lib/
```

## Core Entities (v1)

- `products`
- `stock`
- `orders`
- `order_items`

## Getting Started

```bash
# install dependencies
bun install

# start Postgres + Redis
docker compose up -d

# run migrations
bun run db:migrate

# start dev server
bun run dev
```

## Roadmap / Learning Checklist

- [ ] Layered architecture (Controllers → Services → Repositories)
- [ ] Validation, transformations & DTOs
- [ ] Middlewares & request context
- [ ] Caching & task queues
- [ ] Error handling & logging
- [ ] Monitoring & graceful shutdown
- [ ] Security, scaling & concurrency (stock decrement race conditions, transactions)
- [ ] Testing (unit, integration, concurrency)
- [ ] AWS deployment (ECS/Fargate, RDS, ElastiCache, ALB, CloudWatch, Secrets Manager)

## Health Checks

- `GET /health` — liveness
- `GET /ready` — readiness (checks DB + Redis connectivity)
