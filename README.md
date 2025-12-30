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

## Technical Requirements

### Tech Stack (Required)

- **Backend**: Node.js + NestJS + TypeScript
- **Database**: SQL with [Drizzle ORM](https://orm.drizzle.team/)
- **WebSockets**: NestJS WebSocket Gateway (Socket.IO or native WS)
- **Docs**: OpenAPI/Swagger

### Part 1: REST API

#### 1.1 Book a Flight

```
POST /api/flight/booking
```

**Request Body:**

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

**Success Response (201):**

```json
{
  "bookingId": "uuid",
  "status": "confirmed",
  "outbound": { "flightNumber": "BKJT123", "date": "07/04/2025", "seat": 5 },
  "inbound": { "flightNumber": "BKJT234", "date": "08/04/2025", "seat": 3 }
}
```

**Conflict Response (409):**

```json
{
  "error": "seat_unavailable",
  "message": "Seat 5 on flight BKJT123 (07/04/2025) is no longer available",
  "availableSeats": [1, 2, 6, 7]
}
```

**Critical Requirement:** This endpoint must handle concurrent requests safely. If 10 users simultaneously try to book the same seat, exactly 1 must succeed and 9 must receive a 409 response. No overbookings allowed.

---

### Part 2: WebSocket Gateway

#### 2.1 Real-Time Seat Availability

**Connection:**

```
ws://localhost:3000/flights
```

**Subscribe to a flight:**

```json
{
  "event": "subscribe",
  "data": { "flightNumber": "BKJT123", "date": "07/04/2025" }
}
```

**Immediate response with current availability:**

```json
{
  "event": "seats_snapshot",
  "data": {
    "flightNumber": "BKJT123",
    "date": "07/04/2025",
    "availableSeats": [1, 2, 5, 6, 7],
    "totalSeats": 8,
    "timestamp": "2025-04-01T10:30:00Z"
  }
}
```

**Receive updates when seats change:**

```json
{
  "event": "seats_updated",
  "data": {
    "flightNumber": "BKJT123",
    "date": "07/04/2025",
    "availableSeats": [1, 2, 6, 7],
    "lastBookedSeat": 5,
    "timestamp": "2025-04-01T10:30:00Z"
  }
}
```

**Unsubscribe:**

```json
{
  "event": "unsubscribe",
  "data": { "flightNumber": "BKJT123", "date": "07/04/2025" }
}
```

#### 2.2 Booking Result Notification

When a client attempts to book via REST API, they can also receive the result via WebSocket:

**Success:**

```json
{
  "event": "booking_confirmed",
  "data": {
    "bookingId": "<uuid>",
    "outbound": { "flightNumber": "BKJT123", "seat": 5 },
    "inbound": { "flightNumber": "BKJT234", "seat": 3 }
  }
}
```

**Failure (seat taken by another user):**

```json
{
  "event": "booking_failed",
  "data": {
    "reason": "seat_unavailable",
    "conflictingSeat": { "flightNumber": "BKJT123", "seat": 5 },
    "availableSeats": [1, 2, 6, 7]
  }
}
```

---

### Part 3: Race Condition Handling

You must implement a strategy to prevent race conditions. Document your approach in a section below.

**Acceptable Strategies:**

- Database-level constraints (UNIQUE, transactions with proper isolation)
- Optimistic locki ng (version columns)
- Pessimistic locking (SELECT FOR UPDATE)
- Application-level locking (with caveats documented)

**Test Scenario:**
Flight BKJT999 on 01/05/2025 has only seat 8 available. 10 users simultaneously attempt to book this seat.

**Expected Outcome:**

- Exactly 1 booking succeeds
- Exactly 9 bookings fail with appropriate error
- All WebSocket subscribers see exactly 1 update showing seat 8 as taken
- No database inconsistencies

---

## Deliverables

### Required

- [ ] Working REST API (all 3 endpoints)
- [ ] WebSocket gateway with subscribe/unsubscribe
- [ ] Real-time seat updates broadcast to subscribers
- [ ] Race condition handling (no overbookings)
- [ ] Atomic round-trip bookings (both succeed or both fail)
- [ ] Database schema with Drizzle ORM
- [ ] Seed data loaded from CSV files
- [ ] Unit tests for booking logic
- [ ] Integration test demonstrating race condition handling

### Bonus

- [ ] OpenAPI/Swagger documentation
- [ ] E2E tests with concurrent WebSocket clients
- [ ] Connection recovery handling (client reconnects)
- [ ] Metrics/logging for concurrent booking attempts

---

## Evaluation Criteria

| Criteria           | Weight | Description                                                |
| ------------------ | ------ | ---------------------------------------------------------- |
| **Correctness**    | 30%    | No overbookings under concurrent load, atomic transactions |
| **Real-time Sync** | 25%    | WebSocket clients receive consistent, timely updates       |
| **Code Quality**   | 20%    | Clean architecture, TypeScript usage, error handling       |
| **Testing**        | 15%    | Meaningful tests that verify concurrency behavior          |
| **Documentation**  | 10%    | Clear README, API docs, explanation of locking strategy    |

---

## Your Approach (Fill This Section)

### Concurrency Strategy

_Explain your approach to handling race conditions:_

```
[Your explanation here]
```

### Trade-offs

_What trade-offs did you make? What would you do differently with more time?_

```
[Your explanation here]
```

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
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e
```s
````
