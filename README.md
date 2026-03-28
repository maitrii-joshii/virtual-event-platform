![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-Framework-black)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)

# Virtual Event Management Platform

A RESTful backend system built with **Node.js**, **Express.js**, **JWT**, and **bcrypt** that allows users to manage virtual events and event registrations.

The platform supports **secure authentication**, **role-based access control**, **event management**, and **attendee registrations**. Organizers can create and manage events, while attendees can browse events and register for them.

When a user registers for an event, the system sends a **confirmation email using Mailtrap**, demonstrating integration with an external email service for transactional notifications.

The system follows a clean layered architecture using controllers, services, repositories, and middleware to maintain scalability and separation of concerns.

---

## Features

**Authentication**
- User registration
- Secure login using JWT authentication
- Password hashing using bcrypt

**Event Management**
- Create event (Organizer only)
- Update event (Organizer only)
- Delete event (Organizer only)
- Retrieve all events
- Retrieve an event by ID

**Event Registration**
- Register for an event (Attendee only)
- Retrieve registrations for a specific event (Organizer only)
- Retrieve user registrations (Attendee only)
- Retrieve a specific registration
- Cancel event registration

**Security & Validation**
- Role-based access control (Organizer / Attendee)
- Request validation using Zod
- Centralized error handling
- Rate limiting middleware
- Authentication middleware

---

## Tech Stack

- Node.js
- Express.js
- JWT (Authentication)
- bcrypt (Password hashing)
- Zod (Validation)
- Postman (API testing)

**Email Service:**
- Mailtrap (for sending event registration confirmation emails)

**Storage:**
- In-memory data storage

---

## Project Structure

```
virtual-event-platform/
│
├── node_modules/
│
├── postman/
│   └── virtual-event-platform.postman_collection.json
│
├── screenshots/
│   └── event-registration-confirmation-email.png
│
├── src/
│ │
│ ├── config/
│ │   └── mailtrapClient.js
│ │
│ ├── controllers/
│ │   ├── authController.js
│ │   ├── eventController.js
│ │   └── registrationController.js
│ │
│ ├── errors/
│ │   ├── authError.js
│ │   ├── baseError.js
│ │   ├── entityError.js
│ │   └── requestError.js
│ │
│ ├── middleware/
│ │   ├── authMiddleware.js
│ │   ├── errorHandler.js
│ │   ├── rateLimiter.js
│ │   └── validateRequest.js
│ │
│ ├── repositories/
│ │   ├── eventRepository.js
│ │   ├── inMemoryRepository.js
│ │   ├── registrationRepository.js
│ │   └── userRepository.js
│ │
│ ├── routes/
│ │   ├── authRoutes.js
│ │   ├── eventRoutes.js
│ │   └── registrationRoutes.js
│ │
│ ├── schemas/
│ │   ├── authSchema.js
│ │   ├── eventSchema.js
│ │   └── registrationSchema.js
│ │
│ ├── services/
│ │   ├── authService.js
│ │   ├── eventService.js
│ │   ├── mailService.js
│ │   └── registrationService.js
│ │
│ ├── tests/
│ │   ├── auth.test.js
│ │   ├── event.test.js
│ │   └── registration.test.js
│ │
│ └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md

```

### Folder Explanation

- **config** → External service configurations (Mailtrap client setup)
- **controllers** → Handle incoming HTTP requests and send responses
- **services** → Contains business logic
- **repositories** → Data access layer for interacting with in-memory storage
- **routes** → Defines API endpoints and route mappings
- **schemas** → Zod schemas for request validation
- **middleware** → Authentication, validation, error handling, and rate limiting
- **errors** → Custom error classes for centralized error management
- **tests** → Unit tests for application components
- **postman** → Postman collection for testing API endpoints
- **screenshots** → Screenshots used in the README documentation

---

## Setup Instructions


```bash
# 1. Clone the repository
git clone https://github.com/maitrii-joshii/virtual-event-platform

# 2. Navigate to the repository
cd virtual-event-platform

# 3. Install dependencies
npm install

# 4. Start the server
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=5000
JWT_SECRET=your_jwt_secret_key
MAILTRAP_TOKEN=your_mailtrap_token
SENDER_EMAIL=no-reply@virtualevent.com
SENDER_NAME=Virtual Event Platform
```

---

## API Documentation

Base URL:

```
http://localhost:5000
```

---

### Public Endpoints

### 1. Health Check

**GET** `/health`

Returns the status of the API to confirm that the server is running and operational.

#### Response (200 OK)

```json
{
    "status": "OK",
    "message": "Server is running",
    "timeStamp": "2026-03-28T07:14:16.360Z"
}
```

---

### Authentication Endpoints

### 2. Register User

**POST** `/api/v1/auth/register`

Registers a new user with a specified role (Organizer or Attendee).

#### Request Body

```json
{
    "name": "Albert Einstein",
    "email": "paulalbert519@gmail.com",
    "password": "123456",
    "role": "organizer"
}
```

#### Response (201 Created)

```json
{
    "success": true,
    "user": {
        "name": "Albert Einstein",
        "email": "paulalbert519@gmail.com",
        "password": "$2b$06$isLh5W1w7uz/1CWKRK9CNe32eQYVgomKNdDcAY.B7Cr/ZvUsUjQfm",
        "role": "organizer",
        "id": 1
    },
    "message": "User registered successfully"
}
```

---

### 3. Login User

**POST** `/api/v1/auth/login`

Authenticates a user and logs them into the system based on their role (Organizer or Attendee).

#### Request Body

```json
{
    "email": "paulalbert519@gmail.com",
    "password": "123456",
    "role": "organizer"
}
```

#### Response (200 OK)

```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBhdWxhbGJlcnQ1MTlAZ21haWwuY29tIiwicm9sZSI6Im9yZ2FuaXplciIsImlkIjoxLCJuYW1lIjoiQWxiZXJ0IEVpbnN0ZWluIiwiaWF0IjoxNzc0NjgwNzE5LCJleHAiOjE3NzQ2ODQzMTl9.W2titgifNghaSpe06z9G2SD9rW93R_BAJ9wkSDralVU",
    "message": "User logged in successfully"
}
```

---

### Event Management Endpoints

### 4. Create Event (Organizer Only)

**POST** `/api/v1/events`

Creates a new event. Only users with the organizer role are allowed to create events.

#### Request Body

```json
{
    "title": "Concert",
    "description": "Arjit Singh Live Concert",
    "date": "2026-04-29",
    "time": "12:00",
    "location": "Ahmedabad",
    "participants": ["Arjit Singh", "Shreya Ghoshal"]
}
```

#### Response (201 Created)

```json
{
    "success": true,
    "event": {
        "title": "Concert",
        "description": "Arjit Singh Live Concert",
        "date": "2026-04-29",
        "time": "12:00",
        "location": "Ahmedabad",
        "participants": [
            "Arjit Singh",
            "Shreya Ghoshal"
        ],
        "createdBy": 1,
        "id": 1
    },
    "message": "Event created successfully"
}
```

---

### 5. Update Event (Organizer Only)

**PUT** `/api/v1/events/:id`

Updates an existing event. Only users with the organizer role are allowed to update events.

#### Request Body

```json
{
    "title": "Concert Event",
    "description": "Atif Aslam Event",
    "date": "2026-03-30",
    "time": "09:00",
    "location": "Pune",
    "participants": ["Atif Aslam"]
}
```

#### Response (200 OK)

```json
{
    "success": true,
    "event": {
        "title": "Concert Event",
        "description": "Atif Aslam Event",
        "date": "2026-03-30",
        "time": "09:00",
        "location": "Pune",
        "participants": [
            "Atif Aslam"
        ],
        "createdBy": 1,
        "id": 1
    },
    "message": "Event updated successfully"
}
```

---

### 6. Get All Events

**GET** `/api/v1/events`

Retrieves a list of all available events.

#### Response (200 OK)

```json
{
    "success": true,
    "events": [
        {
            "title": "Concert Event",
            "description": "Atif Aslam Event",
            "date": "2026-03-30",
            "time": "09:00",
            "location": "Pune",
            "participants": [
                "Atif Aslam"
            ],
            "createdBy": 1,
            "id": 1
        },
        {
            "title": "Concert",
            "description": "Arjit Singh Live Concert",
            "date": "2026-04-29",
            "time": "12:00",
            "location": "Ahmedabad",
            "participants": [
                "Arjit Singh",
                "Shreya Ghoshal"
            ],
            "createdBy": 1,
            "id": 2
        }
    ],
    "message": "Events retrieved successfully"
}
```

---

### 7. Get Event By ID

**GET** `/api/v1/events/:id`

Retrieves details of a specific event using its ID.

#### Response (200 OK)

```json
{
    "success": true,
    "event": {
        "title": "Concert",
        "description": "Arjit Singh Live Concert",
        "date": "2026-04-29",
        "time": "12:00",
        "location": "Ahmedabad",
        "participants": [
            "Arjit Singh",
            "Shreya Ghoshal"
        ],
        "createdBy": 1,
        "id": 2
    },
    "message": "Event retrieved successfully"
}
```

---

### 8. Delete Event (Organizer Only)

**DELETE** `/api/v1/events/:id`

Deletes an event.

#### Response (204 No Content)

---

### Event Registration Endpoints

### 9. Register for an Event (Attendee Only)

**POST** `/api/v1/events/:eventId/registrations`

Registers the authenticated user for a specific event.

#### Request Body

```json
{
    "ticketType": "Student",
    "notes": "Register for Concert"
}
```

#### Response (201 Created)

```json
{
    "success": true,
    "registration": {
        "eventId": 1,
        "userId": 2,
        "ticketType": "Student",
        "notes": "Register for Concert",
        "id": 1
    },
    "message": "Event registration created successfully"
}
```

---

### 10. Get User Registrations (Attendee Only)

**GET** `/api/v1/registrations`

Retrieves all event registrations made by the logged-in user.

#### Response (200 OK)

```json
{
    "success": true,
    "registrations": [
        {
            "eventId": 1,
            "userId": 2,
            "ticketType": "Student",
            "notes": "Register for Concert",
            "id": 1
        }
    ],
    "message": "User registrations retrieved successfully"
}
```

---

### 11. Delete Event Registration (Attendee Only)

**DELETE** `/api/v1/events/:eventId/registrations/:registrationId`

Cancels a user's registration for a specific event.

#### Response (204 No Content)

---

### 12. Get Event Registration By ID

**GET** `/api/v1/events/:eventId/registrations/:registrationId`

Retrieves details of a specific registration for an event.

#### Response (200 OK)

```json
{
    "success": true,
    "registration": {
        "eventId": 1,
        "userId": 2,
        "ticketType": "Student",
        "notes": "Register for Concert",
        "id": 1
    },
    "message": "Event registration retrieved successfully"
}
```

---

### 13. Get Event Registrations (Organizer Only)

**GET** `/api/v1/events/:eventId/registrations`

Retrieves all registrations for a specific event.

#### Response (200 OK)

```json
{
    "success": true,
    "registrations": [
        {
            "eventId": 1,
            "userId": 2,
            "ticketType": "Student",
            "notes": "Register for Concert",
            "id": 1
        }
    ],
    "message": "Event registrations retrieved successfully"
}
```

---

## Email Notification

When a user successfully registers for an event, the system sends a confirmation email using Mailtrap.

### Email Confirmation Example

![Event Registration Email](./screenshots/event-registration-confirmation-email.png)

---

## How to Test the API

### Using Postman

1. Open Postman
2. Select HTTP method (GET / POST / PUT / DELETE)
3. Enter the API URL
4. Add request body (JSON) if required
5. Click **Send**

---

### Using CLI

```bash
npm run test
```

---

## Postman Collection

Download the Postman collection:

[Download Collection](./postman/virtual-event-platform.postman_collection.json)

---

## Author

**MJ**
Backend Developer (Node.js | Express.js)