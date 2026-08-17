# CloudBlitz Developer Guide

Welcome to the CloudBlitz Enquiry Management System Developer Guide. This document provides setup instructions, architectural explanations, deployment workflows, and troubleshooting guidelines for developers working on or maintaining this application.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Repository Structure](#-repository-structure)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Environment Configuration](#-environment-configuration)
- [Database Configuration](#-database-configuration)
- [Authentication Flow](#-authentication-flow)
- [Authorization & Role Flow](#-authorization--role-flow)
- [Enquiry Workflow](#-enquiry-workflow)
- [User Management Workflow](#-user-management-workflow)
- [Frontend-Backend Communication](#-frontend-backend-communication)
- [Running Development Servers](#-running-development-servers)
- [Testing & Quality Checks](#-testing--quality-checks)
- [Building the Frontend](#-building-the-frontend)
- [Deployment Architecture](#-deployment-architecture)
- [Render Deployment Instructions](#-render-deployment-instructions)
- [Vercel Deployment Instructions](#-vercel-deployment-instructions)
- [Troubleshooting Common Issues](#-troubleshooting-common-issues)

---

## 🛠️ Prerequisites

Before starting development, ensure you have installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30.0 or higher
- **MongoDB**: Access to a MongoDB Atlas cluster or local MongoDB v6+ server
- **Code Editor**: VS Code (recommended with ESLint and Prettier plugins)

---

## 📁 Repository Structure

The project follows a clean monorepo-style folder layout separating frontend, backend, and documentation:

```
cloudblitz_enquiry_system/
├── Backend/                   # Node.js + Express backend
│   ├── src/
│   │   ├── config/            # DB configuration (db.js)
│   │   ├── controllers/       # Route logic (authController, enquiryController, userController)
│   │   ├── middlewares/       # Middleware (authMiddleware, validate, errorHandler)
│   │   ├── models/            # Mongoose schemas (User, Enquiry)
│   │   ├── routes/            # Route endpoints (authRoutes, enquiryRoutes, userRoutes)
│   │   ├── validators/        # Zod validation schemas (authValidator, enquiryValidator, userValidator)
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # HTTP server initializer
│   ├── .env.example
│   └── package.json
├── Frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Modals, Navbar, EnquiryTable, ProtectedRoute
│   │   ├── context/           # AuthContext, ToastContext
│   │   ├── hooks/             # useAuth, useToast
│   │   ├── pages/             # Login, Register, Dashboard, Enquiries, Users
│   │   ├── routes/            # AppRoutes
│   │   ├── services/          # API fetch wrapper (api.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vercel.json            # Vercel rewrite configuration for React Router
│   └── package.json
├── docs/                      # Technical documentation
│   ├── api.md                 # API Reference
│   ├── architecture.md        # Architecture specification
│   ├── developer-guide.md     # This developer guide
│   └── postman/               # Postman collection
├── package.json               # Root config for Husky & lint-staged
└── README.md
```

---

## ⚙️ Backend Setup

1. Open a terminal and navigate to `Backend/`:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Configure `.env` values (see [Environment Configuration](#-environment-configuration)).
5. Start development server with hot-reload:
   ```bash
   npm run dev
   ```

---

## 💻 Frontend Setup

1. Open a terminal and navigate to `Frontend/`:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Set `VITE_API_URL` to your backend URL (`http://localhost:5000` for local dev).
5. Start Vite dev server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Configuration

### Backend Environment Variables (`Backend/.env`)

| Variable Name    | Description                             | Example / Default                                                |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `PORT`           | Express server port                     | `5000`                                                           |
| `MONGODB_URI`    | MongoDB Atlas cluster connection string | `mongodb+srv://user:pass@cluster.mongodb.net/cloudblitz_enquiry` |
| `JWT_SECRET`     | Secret key used to sign JWT tokens      | `supersecretjwtkey_change_in_production`                         |
| `JWT_EXPIRES_IN` | JWT token expiration time               | `1d`                                                             |
| `NODE_ENV`       | Application execution environment       | `development`                                                    |

### Frontend Environment Variables (`Frontend/.env`)

| Variable Name  | Description                        | Example / Default       |
| -------------- | ---------------------------------- | ----------------------- |
| `VITE_API_URL` | Base URL of the backend API server | `http://localhost:5000` |

---

## 🗄️ Database Configuration

The application uses **Mongoose** to interact with MongoDB Atlas. Connection logic is in `Backend/src/config/db.js`:

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 🔐 Authentication Flow

```
[Client] ➔ POST /auth/login { email, password }
   │
   ▼
[Zod Middleware] ➔ Validates body schema
   │
   ▼
[authController.login]
   ├─ Finds user by email in MongoDB
   ├─ Compares password hash via bcrypt.compare(password, user.passwordHash)
   ├─ Generates JWT token with payload { id: user._id, role: user.role }
   └─ Returns { token, user: { id, name, email, role } }
   │
   ▼
[Client AuthContext] ➔ Stores token in localStorage ("cloudblitz_auth_token")
   └─ Sets Authorization: Bearer <TOKEN> header on all future requests
```

---

## 🛡️ Authorization & Role Flow

- **Roles Supported**: `admin` and `staff`.
- **Server Middleware Guard**: `protect` + `authorizeRoles("admin")`
  ```javascript
  // Express router usage
  router.use(protect, authorizeRoles("admin"));
  ```
- **Execution Order**:
  1. `protect`: Extracts Bearer token, verifies JWT signature, looks up user in database, attaches `req.user`.
  2. `authorizeRoles("admin")`: Checks `req.user.role`. If `!roles.includes(req.user.role)`, returns `403 Forbidden`.
  3. `controller`: Executes business logic.

---

## 📋 Enquiry Workflow

1. **Submission**: User creates enquiry (`POST /enquiries`). Default status is `"New"`.
2. **Filtering & Searching**:
   - Status tabs filter by `status=New`, `status=In Progress`, `status=Closed`, or `status=All`.
   - Search query matches `customerName`, `email`, or `phone` using case-insensitive regex (`GET /enquiries?search=query`).
3. **Status Update**: Staff or admin updates status to `"In Progress"` or `"Closed"` and assigns a team member (`PUT /enquiries/:id`).
4. **Soft Delete**: `DELETE /enquiries/:id` marks `isDeleted: true` and sets `deletedAt`. Soft-deleted items are automatically excluded from normal query results.

---

## 👥 User Management Workflow

- **Admin Only**: All `/users` endpoints require `authorizeRoles("admin")`.
- **Creating Users**: Admin creates user accounts with initial roles (`admin` or `staff`) and passwords (`POST /users`).
- **Editing Users**: Admin updates names, emails, roles, or resets passwords (`PUT /users/:id`).
- **Deleting Users**:
  - `deleteUser` checks `Enquiry.findOne({ assignedTo: id, isDeleted: false })`.
  - If user is assigned to active enquiries, deletion is blocked with a `400 Bad Request` requiring re-assignment first.
  - Self-deletion by the logged-in admin is also blocked.

---

## 🌐 Frontend-Backend Communication

Frontend API requests pass through `Frontend/src/services/api.js`:

```javascript
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "An unexpected error occurred");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
```

---

## 🏃 Running Development Servers

From project root, run both servers in separate terminals:

```bash
# Terminal 1: Backend Server (Port 5000)
cd Backend && npm run dev

# Terminal 2: Frontend Server (Port 5173)
cd Frontend && npm run dev
```

---

## 🧪 Testing & Quality Checks

### Run ESLint Linter

```bash
# Backend linter
cd Backend && npx eslint .

# Frontend linter
cd Frontend && npx eslint .
```

### Run Prettier Formatting

```bash
npx prettier --write "Backend/**/*.js" "Frontend/src/**/*.{js,jsx}"
```

---

## 📦 Building the Frontend

To build the production bundle for the React frontend:

```bash
cd Frontend
npm run build
```

This compiles the output into `Frontend/dist/`.

---

## 🏗️ Deployment Architecture

```
[Vercel - Frontend SPA] (React + Vite)
        │
        │ HTTPS (VITE_API_URL)
        ▼
[Render - Backend API] (Node.js + Express)
        │
        │ MONGODB_URI
        ▼
[MongoDB Atlas] (Cloud Database)
```

---

## 🚀 Render Deployment Instructions (Backend)

1. Sign in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Web Service**.
3. Connect your GitHub repository: `Omurkude/cloudblitz-enquiry-system`.
4. Configure settings:
   - **Name**: `cloudblitz-enquiry-backend`
   - **Root Directory**: `Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<YOUR_MONGODB_ATLAS_URI>`
   - `JWT_SECRET`: `<YOUR_PRODUCTION_JWT_SECRET>`
   - `JWT_EXPIRES_IN`: `1d`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Note the deployed backend URL (e.g. `https://cloudblitz-backend.onrender.com`).

---

## 🔺 Vercel Deployment Instructions (Frontend)

1. Sign in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository: `Omurkude/cloudblitz-enquiry-system`.
4. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_API_URL`: `https://cloudblitz-backend.onrender.com` (your Render backend URL)
6. Ensure `Frontend/vercel.json` exists for SPA routing:
   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
7. Click **Deploy**.

---

## ❓ Troubleshooting Common Issues

### 1. Vercel 404 on Page Refresh (`/dashboard`, `/users`)

- **Cause**: Client-side React Router paths requested directly from Vercel web server without rewrite configuration.
- **Fix**: Ensure `Frontend/vercel.json` exists in `Frontend/` root directory containing rewrite rules to `/index.html`.

### 2. CORS Errors in Browser Console

- **Cause**: Backend CORS policy blocking frontend origin.
- **Fix**: Verify `app.use(cors())` is enabled in `Backend/src/app.js` and `VITE_API_URL` points to the correct backend host.

### 3. MongoDB Connection Timeout

- **Cause**: MongoDB Atlas IP Whitelist blocking deployment server IPs.
- **Fix**: In MongoDB Atlas Network Access, add `0.0.0.0/0` to allow connections from Render cloud instances.
