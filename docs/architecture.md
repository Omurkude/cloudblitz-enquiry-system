# CloudBlitz System Architecture

Technical Architecture and System Design Specification for the CloudBlitz Enquiry Management System.

---

## 📖 Table of Contents

- [High-Level Architecture Diagram](#-high-level-architecture-diagram)
- [End-to-End Component Flow](#-end-to-end-component-flow)
- [Authentication & JWT Lifecycle](#-authentication--jwt-lifecycle)
- [Middleware Execution Pipeline](#-middleware-execution-pipeline)
- [Validation Architecture](#-validation-architecture)
- [MVC Data Pattern](#-mvc-data-pattern)
- [Production Deployment Topology](#-production-deployment-topology)

---

## 🏗️ High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Client Tier ["Frontend (Vercel)"]
        UI["React 19 SPA (Vite)"]
        State["AuthContext / State Management"]
        API_Client["API Service Layer (fetch + Bearer JWT)"]
    end

    subgraph API Tier ["Backend (Render Web Service)"]
        Express["Node.js + Express Server"]
        Cors["CORS & JSON Middleware"]
        AuthMiddleware["JWT Protection Middleware (protect)"]
        RoleMiddleware["RBAC Middleware (authorizeRoles)"]
        ValidatorMiddleware["Zod Validation Middleware"]
        Controllers["Controllers (auth, enquiry, user)"]
    end

    subgraph Database Tier ["Data Layer"]
        Mongoose["Mongoose ORM Models (User, Enquiry)"]
        Atlas["MongoDB Atlas Database Cluster"]
    end

    UI --> State
    State --> API_Client
    API_Client -- "HTTPS / JSON Payload + Bearer Token" --> Express
    Express --> Cors
    Cors --> AuthMiddleware
    AuthMiddleware --> RoleMiddleware
    RoleMiddleware --> ValidatorMiddleware
    ValidatorMiddleware --> Controllers
    Controllers --> Mongoose
    Mongoose -- "MongoDB Driver Query" --> Atlas
```

---

## 🔄 End-to-End Component Flow

1. **User Interaction**: Users interact with the React Single Page Application (SPA) compiled by Vite.
2. **HTTP Communication**: Requests are formatted by `Frontend/src/services/api.js` using standard `fetch` API.
3. **Authentication Header**: If an active token exists in `localStorage` (`cloudblitz_auth_token`), it is automatically attached as an `Authorization: Bearer <TOKEN>` header.
4. **Backend Processing**:
   - `Backend/src/app.js` parses incoming JSON and applies CORS controls.
   - Authentication middleware (`protect`) decodes and verifies the JWT token using `JWT_SECRET`.
   - Role authorization (`authorizeRoles`) validates permissions (`admin` vs `staff`).
   - Zod validation middleware validates input schema compatibility.
   - Controllers handle business logic and perform CRUD operations via Mongoose ORM models (`User`, `Enquiry`).
5. **Database Persistence**: MongoDB Atlas executes query requests over encrypted TLS connections.

---

## 🔐 Authentication & JWT Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant React as React SPA (Frontend)
    participant Express as Express API (Backend)
    participant Mongo as MongoDB Atlas

    User->>React: Enters Login Credentials
    React->>Express: POST /auth/login { email, password }
    Express->>Mongo: Find User by Email
    Mongo-->>Express: User Document (passwordHash)
    Express->>Express: bcrypt.compare(password, passwordHash)
    alt Invalid Credentials
        Express-->>React: 401 Unauthorized { success: false }
        React-->>User: Display Error Alert
    else Valid Credentials
        Express->>Express: jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' })
        Express-->>React: 200 OK { token, user }
        React->>React: Store token in localStorage
        React-->>User: Redirect to /dashboard
    end

    User->>React: Refresh Page / Open App
    React->>Express: GET /auth/me (Authorization: Bearer <token>)
    Express->>Express: jwt.verify(token, JWT_SECRET)
    Express->>Mongo: User.findById(decoded.id)
    Mongo-->>Express: Safe User Document
    Express-->>React: 200 OK { user }
    React-->>User: Restore Authenticated State
```

---

## 🛡️ Middleware Execution Pipeline

All incoming protected API requests execute through a strict, sequential middleware pipeline:

```mermaid
flowchart LR
    A[Incoming Request] --> B[cors / express.json]
    B --> C{Route Protected?}
    C -- No --> D[Controller]
    C -- Yes --> E[protect Middleware]
    E -- Valid Token --> F{Role Restricted?}
    E -- Invalid Token --> G[401 Unauthorized Response]
    F -- No --> H{Validation Required?}
    F -- Yes --> I[authorizeRoles Middleware]
    I -- Role Permitted --> H
    I -- Role Denied --> J[403 Forbidden Response]
    H -- No --> D
    H -- Yes --> K[validate Middleware]
    K -- Schema Valid --> D
    K -- Schema Invalid --> L[400 Bad Request Response]
    D --> M[Global errorHandler]
    M --> N[JSON Response to Client]
```

---

## 📐 Validation Architecture

Requests requiring input validation pass through a generic, reusable Express middleware factory `Backend/src/middlewares/validate.js`:

```javascript
export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.issues) {
      const formattedErrors = (error.issues || []).map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: formattedErrors[0]?.message || "Validation failed",
        errors: formattedErrors,
      });
    }
    next(error);
  }
};
```

This guarantees that controllers receive clean, parsed, and validated data objects.

---

## 🧩 MVC Data Pattern

The backend maintains strict Separation of Concerns:

- **Routes (`Backend/src/routes/`)**: Map HTTP paths and HTTP verbs to appropriate middleware stacks and controllers.
- **Validators (`Backend/src/validators/`)**: Define strict Zod schema constraints.
- **Middlewares (`Backend/src/middlewares/`)**: Perform non-functional cross-cutting concerns (Authentication, Authorization, Logging, Parsing, Error Handling).
- **Controllers (`Backend/src/controllers/`)**: Encapsulate request lifecycle handling, response status codes, and error forwarding (`next(error)`).
- **Models (`Backend/src/models/`)**: Define Mongoose schemas, indexes, soft-delete fields (`isDeleted`), and JSON transforms (`delete ret.passwordHash`).

---

## 🌐 Production Deployment Topology

```mermaid
graph LR
    User Browser -->|HTTPS| Vercel[Vercel Global Edge CDN]
    Vercel -->|Renders SPA| FrontendApp[React Static App]
    FrontendApp -->|API Requests| Render[Render Web Service]
    Render -->|TLS Encrypted Connection| MongoAtlas[(MongoDB Atlas Database)]
```

- **Frontend Hosting (Vercel)**: Serves static compiled React assets over edge CDN. `vercel.json` rewrites all client route paths to `index.html` for single-page client routing.
- **Backend Hosting (Render)**: Hosts the Express server as an auto-managed HTTPS Node.js service.
- **Database Hosting (MongoDB Atlas)**: Managed MongoDB cloud database with TLS transport encryption and network IP security controls.
