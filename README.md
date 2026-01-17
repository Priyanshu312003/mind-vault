# 🧠 MindVault

MindVault is a **backend-first second brain application** designed to help users **save, organize, search, and share knowledge** in a structured and scalable way.

This repository currently contains the **backend API**, built with clean architecture and clear separation of concerns.

---

## 🚧 Project Status

**Actively developed backend. Frontend not yet integrated.**

This is not a demo or tutorial project — it’s a real API with authentication, ownership checks, and extensible design.

---

## 🛠 Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT Authentication**

---

## 🧩 Architecture Overview

```
backend/
├── src/
│ ├── app.ts # Express app setup
│ ├── server.ts # Server bootstrap
│ ├── config/
│ │ └── db.ts # MongoDB connection
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Auth & plan guards
│ ├── models/ # Mongoose schemas
│ └── routes/ # API routes
```

### Design Principles
- Backend-first development
- Clear controller–route–model separation
- Ownership enforced at controller level
- Plan-based feature gating via middleware

---

## ✨ Features Implemented

### 🔐 Authentication
- User signup & login
- Password hashing
- JWT-based authentication
- `/me` endpoint for authenticated users

### 📄 Content Management
- Create, read, update, delete content
- User ownership enforced
- Content requires **either a link or a description**
- Tags are mandatory and validated

### 🏷 Tags
- User-scoped tags
- Composite uniqueness (`title + userId`)
- Safe deletion with ownership checks

### 🔗 Sharing
- Share schema implemented
- Supports:
  - Brain-level sharing
  - Item-level sharing
- Permission modes:
  - READ
  - WRITE (planned)

### 💳 Plans
- FREE / PRO plan distinction
- Plan middleware implemented
- Designed for future billing integration

---

## 🌐 API Routes Overview

### 🔐 Auth
POST /api/v1/auth/signup
POST /api/v1/auth/login
GET /api/v1/auth/me

### 📄 Content
POST /api/v1/content
GET /api/v1/content
GET /api/v1/content/:id
PUT /api/v1/content/:id
DELETE /api/v1/content/:id

### 🏷 Tags
POST /api/v1/tags
GET /api/v1/tags
DELETE /api/v1/tags/:id

### 🔗 Sharing
POST /api/v1/share
GET /api/v1/share/:id

### 🔍 Search & 💰 Billing
- Routes scaffolded
- Logic to be implemented later

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Environment validation is intentionally deferred until deployment.

▶️ Running Locally
bash
Copy code
cd backend
npm install
npm run dev
The server will start on the configured PORT.

⚠️ Known Limitations (Intentional)
No frontend yet

No semantic search implementation

AI features not wired

Billing logic not implemented

Some schema validation errors currently return generic responses

These are acknowledged tradeoffs, not oversights.

🗺 Roadmap
🔍 Semantic search (PRO-only)

💳 Billing integration

✍️ Share WRITE permissions

🎨 Frontend (React + Tailwind)

🧹 Error & validation polish

🔠 Case-insensitive tags

📄 License
MIT