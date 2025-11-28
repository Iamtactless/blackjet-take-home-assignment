# BlackJet Airlines - Flight Booking API

A flight booking system backend API for BlackJet Airlines.

## Business Rules

- Each flight has **8 seats** (numbered 1-8)
- All bookings are **round trips** (outbound + inbound)
- Empty seat bookings are automatically confirmed

## Tech Stack

- **Backend**: Node.js + NestJS + TypeScript
- **Database**: SQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Docs**: OpenAPI/Swagger

## API Endpoints

### 1. Book a Flight
```
POST /flight/booking
```
| Field | Example |
|-------|---------|
| Outbound Flight | BKJT123, 07/04/2025 |
| Inbound Flight | BKJT234, 08/04/2025 |
| Outbound Seat | 1 |
| Inbound Seat | 1 |
| User ID | 1 |

### 2. Get All Flights (Paginated)
```
GET /flights?flightNumber=BKJT123&date=07/04/2025
```

### 3. Get User Itineraries
```
GET /flights/itineraries?userId=1
```

## Seed Data

CSV files in `seed_data/`:

| File | Contents |
|------|----------|
| `flights.csv` | Flight numbers, dates, occupied seats |
| `users.csv` | User ID, name, number of pets (0-2) |
| `seatings.csv` | Flight-to-user seat assignments |

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
