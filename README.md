# BlackJet Airlines - Take Home Assignment

## Overview

Build a flight booking system backend API for BlackJet Airlines that handles seat reservations and
pet accommodations.

## Setup & Running

1. Install [Node.js](https://nodejs.org/en/)
2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm run dev
```

4. Access the application at `http://localhost:3000`

## Business Rules

### Flight & Booking Rules

- Each flight has 8 seats (numbered 1-8)
- All bookings are round trips
- Empty seat bookings are automatically confirmed
- Maximum 2 pets allowed per flight

### Pet Booking Rules

- For non-empty flights with pet bookings:
  - Initial status is submitted
  - Existing passengers have 1 hour to reject pet presence due to:
    - Health concerns (e.g., allergies)
    - Personal comfort (e.g., fear of animals)
    - Medical conditions
  - Any rejection cancels the entire round trip itinerary of the passenger who book the flight with
    pets
  - If no rejections within 1 hour, booking is automatically confirmed
- For empty flights:
  - Pet bookings are automatically confirmed
  - No rejection period needed

## The Assignment

Design and build the necessary API endpoints to support BlackJet's booking system. Your solution
should include:

### Technical Requirements

- Backend: Node.js with Express and TypeScript
- Database: Any SQL Database with [Drizzle ORM](https://orm.drizzle.team/)
- Documentation: OpenAPI/Swagger specification

### Functional Requirements

1. Database schema design with necessary tables and relationships
2. API endpoint specifications including:
   - Routes
   - Request/response formats
   - Status codes
3. Edge cases handling
4. Error handling
5. Git commits
6. [Optional] Dockerise the app

### Endpoints

1. API endpoint for user to book the flight - eg. POST /flight/booking
   - This endpoint should accept the following:
   - Outbound Flight Number and Date - eg. BKJT123, 07/04/2025
   - Inbound Flight Number and Date - eg. BKJT234, 08/04/2025
   - Seat number - eg. 1
   - User id - eg. 1
2. API endpoint to get all flights - eg. GET /flights
   - This endpoint should be paginated and should accept the following:
   - Flight number - eg. BKJT123 (optional)
   - Date - eg. 07/04/2025 (optional)
3. API endpoint to get user booking itineraries - eg. GET /flights/itineraries
   - User id - eg. 1
4. API endpoint to reject pets on flight - eg. POST /flights/rejection
   - This endpoint should accept the following:
   - Flight number - eg. BKJT123
   - Date - eg. 07/04/2025
   - Confirmed Seat Number - eg. 4
5. Cron job to confirm/cancel pet booking based on whether someone accept/reject having pets on flight

### Seed Data

The `seed_data` directory contains the following CSV files for seeding the database:

#### flights.csv
Contains flight information:
- Flight numbers (format: BKJT123)
- Flight dates
- Currently occupied seats

Sample format:
```csv
Flight_Number,Date,Seats_Taken
BKJT456,07/04/2025,"1,4,6"
BKJT234,09/04/2025,"2,5"
```

#### users.csv
Contains user information:
- User ID
- First name
- Last name
- Number of pets (between 0-2)

Sample format:
```csv
Id,First_Name,Last_Name,Number_of_Pets
1,Emma,Thompson,0
2,James,Wilson,0
15,Harper,Jones,2
```

#### seatings.csv
Maps flights to users by seat assignments:
- Flight number
- Flight date
- Seat number
- User ID (references users.csv)

Sample format:
```csv
Flight_Number,Date,Seat_Number,User_Id
BKJT456,07/04/2025,1,1
BKJT456,07/04/2025,4,15
BKJT456,07/04/2025,6,7
```

You should use this data to:
1. Seed your database
2. Test your booking system
3. Validate your API endpoints

## Assignment Deliverables

1. Database Schema Design

   - Design tables and relationships
   - Implement using Drizzle ORM

2. API Implementation

   - Implement the three required endpoints
   - Include request/response formats
   - Proper status code usage

3. Error Handling

   - Handle edge cases
   - Implement proper error responses

4. Documentation

   - OpenAPI/Swagger documentation
   - Code comments where necessary

5. Code Organization

   - Clear folder structure
   - Clean code practices

6. Testing

   - Clear testing methodology

7. [Optional] Docker Support

   - Dockerfile
   - Docker Compose (if needed)

## Submission Guidelines

- Use Git with meaningful commits
- Include setup instructions
- Document any assumptions made
- Explain any additional features or decisions

## Tips

- Focus on code quality and organization
- Consider edge cases in your implementation
- Write clear documentation
- Include tests
