# BlackJet Airlines - Flight Booking API

A flight booking system backend API for BlackJet Airlines.

## The Challenge

BlackJet Airlines is experiencing a surge in bookings. During peak times, multiple customers attempt to book the same seats simultaneously, leading to overbookings and frustrated customers.

Your task is to build a **real-time flight booking system** that:

1. Handles **concurrent booking requests** without overbooking (race condition handling)
2. Provides **real-time seat availability updates** via WebSockets
3. Ensures **data consistency** across all connected clients

---

## Business Rules

- Each flight has **8 seats** (numbered 1-8)
- All bookings are **round trips** (outbound + inbound)
- A seat can only be booked by **one user** per flight
- Bookings are **atomic**: both outbound and inbound seats must be available, or the entire booking fails
- Empty seat bookings are automatically confirmed

---

## Deliverables

### REST API Endpoint

| Method | Endpoint              | Description              |
| ------ | --------------------- | ------------------------ |
| `POST` | `/api/flight/booking` | Book a round-trip flight |

#### Request Payload

```json
{
  "outboundFlightNumber": "BKJT123",
  "outboundDate": "07/04/2025",
  "outboundSeat": 5,
  "inboundFlightNumber": "BKJT234",
  "inboundDate": "08/04/2025",
  "inboundSeat": 3,
  "userId": 1
}
```

#### Success Response (201 Created)

```json
{
  "bookingId": "uuid",
  "status": "confirmed",
  "outbound": { "flightNumber": "BKJT123", "date": "07/04/2025", "seat": 5 },
  "inbound": { "flightNumber": "BKJT234", "date": "08/04/2025", "seat": 3 }
}
```

#### Error Response (409 Conflict)

```json
{
  "error": "seat_unavailable",
  "message": "Seat 5 on flight BKJT123 (07/04/2025) is no longer available",
  "availableSeats": [1, 2, 6, 7]
}
```

**Critical Requirement:** This endpoint must handle concurrent requests safely. If 10 users simultaneously try to book the same seat, exactly 1 must succeed and 9 must receive a 409 response. No overbookings allowed.

---

### WebSocket Gateway

**Connection URL:** `ws://localhost:3000`

| Event (Client → Server) | Payload                                               | Description                            |
| ----------------------- | ----------------------------------------------------- | -------------------------------------- |
| `subscribe`             | `{ "flightNumber": "BKJT123", "date": "07/04/2025" }` | Subscribe to seat updates for a flight |
| `unsubscribe`           | `{ "flightNumber": "BKJT123", "date": "07/04/2025" }` | Unsubscribe from a flight              |

| Event (Server → Client) | Payload   | Description                         |
| ----------------------- | --------- | ----------------------------------- |
| `seats_snapshot`        | See below | Sent immediately after subscribing  |
| `seats_updated`         | See below | Sent when seat availability changes |

#### `seats_snapshot` (sent on subscribe)

```json
{
  "flightNumber": "BKJT123",
  "date": "07/04/2025",
  "availableSeats": [1, 2, 5, 6, 7],
  "totalSeats": 8,
  "timestamp": "2025-04-01T10:30:00Z"
}
```

#### `seats_updated` (sent when booking occurs)

```json
{
  "flightNumber": "BKJT123",
  "date": "07/04/2025",
  "availableSeats": [1, 2, 6, 7],
  "lastBookedSeat": 5,
  "timestamp": "2025-04-01T10:30:00Z"
}
```

---

### Race Condition Handling

You must implement a strategy to prevent race conditions. Document your approach.

**Acceptable Strategies:**

- Database-level constraints (UNIQUE, transactions with proper isolation)
- Optimistic locking (version columns)
- Pessimistic locking (SELECT FOR UPDATE)
- Application-level locking (with caveats documented)

**Test Scenario:**
Flight BKJT999 on 01/05/2025 has only seat 8 available. 10 users simultaneously attempt to book this seat.

**Expected Outcome:**

- Exactly 1 booking succeeds
- Exactly 9 bookings fail with 409 error
- All WebSocket subscribers see exactly 1 `seats_updated` event
- No database inconsistencies

---

## Checklist

### Required

- [ ] `POST /api/flight/booking` - handles concurrent requests safely
- [ ] WebSocket `subscribe` event - returns `seats_snapshot`
- [ ] WebSocket `seats_updated` broadcast - sent to all subscribers when booking occurs
- [ ] Race condition handling - no overbookings under load
- [ ] Atomic bookings - both outbound and inbound succeed or both fail
- [ ] Database schema with Drizzle ORM
- [ ] Seed data loaded from CSV files
- [ ] Unit tests for booking logic
- [ ] Integration test demonstrating race condition handling
- [ ] OpenAPI/Swagger documentations

### Bonus

- [ ] E2E tests with concurrent WebSocket clients
- [ ] Connection recovery handling (client reconnects)
- [ ] Metrics/logging for concurrent booking attempts

---

## Tech Stack

- **Backend**: Node.js + NestJS + TypeScript
- **Database**: SQL with [Drizzle ORM](https://orm.drizzle.team/)
- **WebSockets**: NestJS WebSocket Gateway (Socket.IO)
- **Docs**: OpenAPI/Swagger (bonus)

---

## Seed Data

CSV files in `seed_data/`:

| File           | Contents                              |
| -------------- | ------------------------------------- |
| `flights.csv`  | Flight numbers, dates, occupied seats |
| `users.csv`    | User ID, name, number of pets (0-2)   |
| `seatings.csv` | Flight-to-user seat assignments       |

---

## Project Structure (Clean Architecture)

```
src/
├── app.module.ts              # Main module
├── main.ts                    # Entry point
├── modules/
│   └── <feature>/
│       ├── domain/            # Entities & interfaces
│       ├── application/       # Use cases
│       ├── infrastructure/    # Repositories
│       └── presentation/      # Controllers & DTOs
└── shared/                    # Helpers & bootstrap
```

**Layers**: Domain (business rules) → Application (use cases) → Infrastructure (data) → Presentation (HTTP)

---

## Getting Started

````bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Test the sample WebSocket implementation
pnpm test:ws
```

A sample WebSocket gateway is provided in `src/modules/hello/presentation/gateways/hello.gateway.ts` for reference. Run `pnpm test:ws` to see how it works.
````
