# CloudBlitz Enquiry Management System

A full-stack, enterprise-grade Enquiry Management System designed for tracking, assigning, and managing customer inquiries. Built with a modern JavaScript stack using React, Vite, Node.js, Express, and MongoDB Atlas.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Authentication & Authorization](#-authentication--authorization)
- [Enquiry Management](#-enquiry-management)
- [User Management](#-user-management)
- [Environment Variables](#-environment-variables)
- [Local Development Setup](#-local-development-setup)
- [API Overview](#-api-overview)
- [Production Deployment](#-production-deployment)
- [Live URLs](#-live-urls)
- [Testing Instructions](#-testing-instructions)
- [Git & GitHub Workflow](#-git--github-workflow)
- [Future Improvements](#-future-improvements)

---

## 🎯 Overview

The **CloudBlitz Enquiry Management System** enables organizations to collect, categorize, assign, and resolve customer inquiries efficiently. It features role-based access control (RBAC), real-time status filtering, debounced search, assignment tracking, soft-deletion safety mechanisms, and responsive UI dashboards with feedback toast notifications.

---

## ✨ Key Features

- 🔐 **Secure Authentication**: JWT-based session management with encrypted bcryptjs password hashing.
- 🛡️ **Role-Based Access Control (RBAC)**: Enforced server-side permissions for `admin` and `staff` roles.
- 📋 **Enquiry Management**: Complete CRUD operations for customer inquiries with status workflows (`New`, `In Progress`, `Closed`).
- 👥 **Team Assignment**: Assign enquiries to team members for accountability.
- 🔍 **Search & Filtering**: Real-time debounced regex search across customer names, emails, and phone numbers with status tab filters.
- 🗑️ **Soft Deletion**: Non-destructive deletion model (`isDeleted: true`, `deletedAt`) keeping historical data safe.
- 👤 **Admin User Management**: Admin panel to create, update, and manage system user accounts with dependency checks before user deletion.
- 🎨 **Modern Responsive UI**: Built with React, Tailwind CSS, Lucide icons, and toast notification alerts.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 + Vite 8
- **Language**: JavaScript (ES Modules)
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS + Tailwind CSS v4
- **Icons**: Lucide React
- **Hosting**: Vercel (SPA with `vercel.json` rewrite routing)

### Backend

- **Runtime**: Node.js
- **Framework**: Express v5
- **Database**: MongoDB Atlas via Mongoose v9
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Validation**: Zod v4
- **Security & Utilities**: CORS, `dotenv`
- **Hosting**: Render (Web Service)

---

## 📁 Project Structure

```
cloudblitz_enquiry_system/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database connection (db.js)
│   │   ├── controllers/     # Route controllers (auth, enquiry, user)
│   │   ├── middlewares/     # Auth, role authorization, validation, error handler
│   │   ├── models/          # Mongoose models (User, Enquiry)
│   │   ├── routes/          # Express route definitions
│   │   ├── validators/      # Zod validation schemas
│   │   ├── app.js           # Express app setup & middleware mounting
│   │   └── server.js        # Entry point & port binding
│   ├── .env.example         # Reference environment configuration
│   ├── eslint.config.js     # Backend ESLint configuration
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/      # Modals, tables, navbar, route guards
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── hooks/           # useAuth, useToast
│   │   ├── pages/           # Login, Register, Dashboard, Enquiries, Users
│   │   ├── routes/          # AppRoutes definition
│   │   ├── services/        # Centralized API fetch client (api.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example         # Frontend API URL configuration
│   ├── vercel.json          # Vercel SPA routing rewrite rules
│   └── package.json
├── docs/                    # Complete developer & API documentation
│   ├── api.md               # Complete API Reference
│   ├── architecture.md      # Architecture specification & Mermaid diagrams
│   ├── developer-guide.md   # Developer setup & deployment guide
│   └── postman/             # Postman Collection JSON
├── package.json             # Root package file (Husky & lint-staged)
└── README.md
```

---

## 🔒 Authentication & Authorization

- **JWT Sessions**: Authentication generates a signed JSON Web Token valid for 1 day (`JWT_EXPIRES_IN=1d`). Tokens are sent via the `Authorization: Bearer <TOKEN>` header.
- **Password Security**: Passwords are hashed with `bcryptjs` (salt rounds: 10). `passwordHash` is excluded from all API JSON responses.
- **Server-Side RBAC**: The `authorizeRoles("admin")` middleware verifies user roles directly from authenticated server tokens, ensuring non-admin users cannot bypass frontend controls.

---

## 📋 Enquiry Management

Enquiries support the full customer lifecycle:

1. **Creation**: Customers or staff submit enquiries (`customerName`, `email`, `phone`, `message`, optional `assignedTo`).
2. **Status Workflow**: Enquiries transition through `New` ➔ `In Progress` ➔ `Closed`.
3. **Assignment**: Enquiries can be assigned to staff members.
4. **Soft Deletion**: Deleting an enquiry sets `isDeleted: true` and `deletedAt`. Soft-deleted enquiries are automatically omitted from normal listing and single-item queries.

---

## 👤 User Management

Administrators have exclusive control over system accounts:

- List all active system users (`id`, `name`, `email`, `role`, `createdAt`).
- Create new `staff` or `admin` user accounts with encrypted passwords.
- Update user roles, names, emails, or reset passwords.
- Delete users with **dependency checks**: Prevents deleting users currently assigned to active enquiries or deleting the logged-in admin's own account.

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/cloudblitz_enquiry
JWT_SECRET=supersecretjwtkey_change_in_production
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Git
- MongoDB Atlas cluster URI or local MongoDB instance

---

## ⚙️ Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the backend dev server:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

---

## 💻 Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend application will run on `http://localhost:5173`.

---

## 🏃 How to Run the Project Locally

Run both servers concurrently in separate terminals:

```bash
# Terminal 1 - Backend
cd Backend && npm run dev

# Terminal 2 - Frontend
cd Frontend && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📡 API Overview

| Method   | Endpoint               | Protection | Description                                        |
| -------- | ---------------------- | ---------- | -------------------------------------------------- |
| `GET`    | `/api/health`          | Public     | Server health status check                         |
| `POST`   | `/auth/register`       | Public     | Register a new staff user                          |
| `POST`   | `/auth/login`          | Public     | Authenticate user & receive JWT token              |
| `GET`    | `/auth/me`             | Protected  | Fetch currently authenticated user payload         |
| `POST`   | `/enquiries`           | Protected  | Create a new enquiry                               |
| `GET`    | `/enquiries`           | Protected  | List active enquiries with status & search filters |
| `GET`    | `/enquiries/assignees` | Protected  | List team users available for enquiry assignment   |
| `GET`    | `/enquiries/:id`       | Protected  | Fetch single active enquiry by ID                  |
| `PUT`    | `/enquiries/:id`       | Protected  | Update enquiry status, assignee, or details        |
| `DELETE` | `/enquiries/:id`       | Protected  | Soft-delete enquiry (`isDeleted: true`)            |
| `GET`    | `/users`               | Admin Only | List all system users                              |
| `POST`   | `/users`               | Admin Only | Create a new user (`admin` or `staff`)             |
| `PUT`    | `/users/:id`           | Admin Only | Update user role, details, or password             |
| `DELETE` | `/users/:id`           | Admin Only | Delete user (with active enquiry check)            |

_For complete request payloads, parameters, and responses, see [docs/api.md](docs/api.md)._

---

## 🌐 Production Deployment

- **Backend (Render)**: Deployed as a Web Service running Node.js. Environment variables (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`) are configured in the Render Dashboard.
- **Frontend (Vercel)**: Deployed as a Vite Static Web App. The `vercel.json` file configures rewrite rules (`/ (.*)` ➔ `/index.html`) to support client-side React Router navigation. `VITE_API_URL` points to the production Render backend URL.

---

## 🔗 Live URLs

- **Frontend Application**: `https://cloudblitz-enquiry-system.vercel.app` (or your Vercel deployment URL)
- **Backend API**: `https://cloudblitz-enquiry-system.onrender.com` (or your Render service URL)

---

## 🧪 Testing Instructions

### Linter & Formatting Checks

```bash
# Run Backend ESLint
cd Backend && npx eslint .

# Run Frontend ESLint
cd Frontend && npx eslint .

# Run Prettier code formatting
npx prettier --write "Backend/**/*.js" "Frontend/src/**/*.{js,jsx}"
```

### API Testing via Postman

Import the Postman collection located at `docs/postman/cloudblitz_enquiry_system.postman_collection.json`. Set `{{baseUrl}}` to `http://localhost:5000` and `{{token}}` to your authenticated JWT.

---

## 🔀 Git & GitHub Workflow Used

1. **Branching Strategy**: Feature branches were created off `main` for each epic:
   - `feature/project-setup`
   - `feature/authentication`
   - `feature/enquiries`
   - `feature/users`
   - `feature/documentation`
2. **Commit Policy**: Pre-commit hooks via Husky and `lint-staged` automatically run Prettier formatting before commits.
3. **Pull Requests**: Feature branches were pushed to GitHub and fast-forward merged into `main`.

---

## 🔮 Future Improvements

- 🔔 Real-time WebSocket notifications for new enquiry submissions.
- 📊 Advanced analytics dashboard (enquiry conversion rate, resolution SLA tracking).
- ✉️ Email notifications to customers upon status changes.
- 📎 File attachment support for enquiries.
- 🌐 Internationalization (i18n) support.
