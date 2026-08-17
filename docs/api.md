# CloudBlitz API Documentation

Complete API Reference for the CloudBlitz Enquiry Management System backend REST API.

---

## 📖 Table of Contents

- [General Info & Base URL](#-general-info--base-url)
- [Health Check](#-health-check)
- [Authentication Endpoints](#-authentication-endpoints)
  - [POST /auth/register](#post-authregister)
  - [POST /auth/login](#post-authlogin)
  - [GET /auth/me](#get-authme)
- [Enquiry Management Endpoints](#-enquiry-management-endpoints)
  - [POST /enquiries](#post-enquiries)
  - [GET /enquiries](#get-enquiries)
  - [GET /enquiries/assignees](#get-enquiriesassignees)
  - [GET /enquiries/:id](#get-enquiriesid)
  - [PUT /enquiries/:id](#put-enquiriesid)
  - [DELETE /enquiries/:id](#delete-enquiriesid)
- [User Management Endpoints (Admin Only)](#-user-management-endpoints-admin-only)
  - [GET /users](#get-users)
  - [POST /users](#post-users)
  - [PUT /users/:id](#put-usersid)
  - [DELETE /users/:id](#delete-usersid)

---

## 🌐 General Info & Base URL

- **Local Base URL**: `http://localhost:5000`
- **Production Base URL**: `https://cloudblitz-enquiry-system.onrender.com`
- **Headers for Protected Endpoints**:
  ```http
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```

---

## 🟢 Health Check

### `GET /api/health`

Checks if backend API server is running.

- **Authentication**: None (Public)
- **Authorization**: None

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 🔐 Authentication Endpoints

### `POST /auth/register`

Registers a new public user. Public registration assigns the default `staff` role.

- **Authentication**: None (Public)
- **Authorization**: None

#### Request Body

```json
{
  "name": "Jane Staff",
  "email": "jane@example.com",
  "password": "password123"
}
```

#### Success Response (`201 Created`)

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "66b1234567890abcdef12345",
    "name": "Jane Staff",
    "email": "jane@example.com",
    "role": "staff",
    "createdAt": "2026-08-17T12:00:00.000Z"
  }
}
```

#### Error Responses

- **`400 Bad Request`** (Validation failure or duplicate email):
  ```json
  {
    "success": false,
    "message": "Email is already registered"
  }
  ```

---

### `POST /auth/login`

Authenticates credentials and returns a signed JWT token.

- **Authentication**: None (Public)
- **Authorization**: None

#### Request Body

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "66b1234567890abcdef12345",
    "name": "Jane Staff",
    "email": "jane@example.com",
    "role": "staff"
  }
}
```

#### Error Responses

- **`401 Unauthorized`** (Invalid credentials):
  ```json
  {
    "success": false,
    "message": "Invalid email or password"
  }
  ```

---

### `GET /auth/me`

Fetches profile details of the currently authenticated user.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "user": {
    "id": "66b1234567890abcdef12345",
    "name": "Jane Staff",
    "email": "jane@example.com",
    "role": "staff"
  }
}
```

#### Error Responses

- **`401 Unauthorized`** (Missing or invalid token):
  ```json
  {
    "success": false,
    "message": "Access token required. Please log in."
  }
  ```

---

## 📋 Enquiry Management Endpoints

### `POST /enquiries`

Creates a new customer enquiry.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Request Body

```json
{
  "customerName": "Robert Smith",
  "email": "robert@example.com",
  "phone": "+15551234567",
  "message": "Inquiry regarding cloud migration services.",
  "status": "New",
  "assignedTo": "66b1234567890abcdef12345"
}
```

#### Success Response (`201 Created`)

```json
{
  "success": true,
  "message": "Enquiry created successfully",
  "enquiry": {
    "_id": "66c9876543210fedcba54321",
    "customerName": "Robert Smith",
    "email": "robert@example.com",
    "phone": "+15551234567",
    "message": "Inquiry regarding cloud migration services.",
    "status": "New",
    "assignedTo": {
      "_id": "66b1234567890abcdef12345",
      "name": "Jane Staff",
      "email": "jane@example.com",
      "role": "staff"
    },
    "isDeleted": false,
    "deletedAt": null,
    "createdAt": "2026-08-17T12:30:00.000Z",
    "updatedAt": "2026-08-17T12:30:00.000Z"
  }
}
```

---

### `GET /enquiries`

Retrieves active non-deleted enquiries with optional filtering and search.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Query Parameters

- `status` _(optional)_: Filter by status (`New`, `In Progress`, `Closed`, or `All`).
- `search` _(optional)_: Search string matching `customerName`, `email`, or `phone`.
- `assignedTo` _(optional)_: Filter by assigned user ObjectId.

#### Example Request

`GET /enquiries?status=In%20Progress&search=robert`

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "count": 1,
  "enquiries": [
    {
      "_id": "66c9876543210fedcba54321",
      "customerName": "Robert Smith",
      "email": "robert@example.com",
      "phone": "+15551234567",
      "message": "Inquiry regarding cloud migration services.",
      "status": "In Progress",
      "assignedTo": {
        "_id": "66b1234567890abcdef12345",
        "name": "Jane Staff",
        "email": "jane@example.com",
        "role": "staff"
      },
      "isDeleted": false,
      "createdAt": "2026-08-17T12:30:00.000Z"
    }
  ]
}
```

---

### `GET /enquiries/assignees`

Retrieves list of team members (`id`, `name`, `email`, `role`) available for assignment.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "users": [
    {
      "_id": "66b1234567890abcdef12345",
      "name": "Jane Staff",
      "email": "jane@example.com",
      "role": "staff"
    }
  ]
}
```

---

### `GET /enquiries/:id`

Retrieves details of a single non-deleted enquiry by ID.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Path Parameters

- `id` _(required)_: Mongoose ObjectId of the enquiry.

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "enquiry": {
    "_id": "66c9876543210fedcba54321",
    "customerName": "Robert Smith",
    "email": "robert@example.com",
    "phone": "+15551234567",
    "message": "Inquiry regarding cloud migration services.",
    "status": "New",
    "assignedTo": null,
    "isDeleted": false,
    "createdAt": "2026-08-17T12:30:00.000Z"
  }
}
```

#### Error Responses

- **`404 Not Found`** (Enquiry missing or soft-deleted):
  ```json
  {
    "success": false,
    "message": "Enquiry not found"
  }
  ```

---

### `PUT /enquiries/:id`

Updates fields of an existing enquiry.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Request Body

```json
{
  "status": "Closed",
  "assignedTo": "66b1234567890abcdef12345"
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "Enquiry updated successfully",
  "enquiry": {
    "_id": "66c9876543210fedcba54321",
    "customerName": "Robert Smith",
    "email": "robert@example.com",
    "phone": "+15551234567",
    "message": "Inquiry regarding cloud migration services.",
    "status": "Closed",
    "assignedTo": {
      "_id": "66b1234567890abcdef12345",
      "name": "Jane Staff",
      "email": "jane@example.com",
      "role": "staff"
    },
    "updatedAt": "2026-08-17T13:00:00.000Z"
  }
}
```

---

### `DELETE /enquiries/:id`

Performs **soft deletion** of an enquiry (`isDeleted: true`, `deletedAt: Date`).

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` or `staff`

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "Enquiry deleted successfully"
}
```

---

## 👥 User Management Endpoints (Admin Only)

### `GET /users`

Retrieves list of all system users.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` Only

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "66a000000000000000000001",
      "name": "Alex Admin",
      "email": "admin@cloudblitz.com",
      "role": "admin",
      "createdAt": "2026-08-17T10:00:00.000Z"
    },
    {
      "_id": "66b1234567890abcdef12345",
      "name": "Jane Staff",
      "email": "jane@example.com",
      "role": "staff",
      "createdAt": "2026-08-17T12:00:00.000Z"
    }
  ]
}
```

#### Error Responses

- **`403 Forbidden`** (Non-admin user request):
  ```json
  {
    "success": false,
    "message": "Access denied. Role 'staff' is not authorized to access this resource."
  }
  ```

---

### `POST /users`

Admin creates a new user (`admin` or `staff`).

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` Only

#### Request Body

```json
{
  "name": "Michael Scott",
  "email": "michael@cloudblitz.com",
  "password": "password123",
  "role": "staff"
}
```

#### Success Response (`201 Created`)

```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "66d999999999999999999999",
    "name": "Michael Scott",
    "email": "michael@cloudblitz.com",
    "role": "staff",
    "createdAt": "2026-08-17T14:00:00.000Z"
  }
}
```

---

### `PUT /users/:id`

Admin updates user details, role, or password.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` Only

#### Request Body

```json
{
  "name": "Michael G. Scott",
  "role": "admin"
}
```

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "66d999999999999999999999",
    "name": "Michael G. Scott",
    "email": "michael@cloudblitz.com",
    "role": "admin"
  }
}
```

---

### `DELETE /users/:id`

Deletes a user account. Checks that the user is not assigned to active enquiries and is not self-deleting.

- **Authentication**: Required (`Bearer <token>`)
- **Authorization**: `admin` Only

#### Success Response (`200 OK`)

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Error Responses

- **`400 Bad Request`** (Assigned to active enquiries):
  ```json
  {
    "success": false,
    "message": "Cannot delete user who is currently assigned to active enquiries. Please reassign or unassign their enquiries first."
  }
  ```
