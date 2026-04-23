# 🔐 VaultKey — Password Manager

A production-ready, full-stack password manager built with React, Node.js, MongoDB, and Clerk authentication. All passwords are encrypted with AES-256-GCM before storage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Auth | Clerk (sign up, sign in, session) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose) |
| Encryption | AES-256-GCM (Node.js `crypto`) |
| Deployment | Vercel (frontend) + Render/Railway (backend) |

## Features

- ✅ Clerk authentication (sign up / sign in / sign out)
- ✅ Add, view, edit, delete credentials
- ✅ AES-256-GCM password encryption at rest
- ✅ Show/hide password toggle
- ✅ One-click copy to clipboard
- ✅ Password strength indicator
- ✅ Strong password generator
- ✅ Website favicon auto-fetch
- ✅ Search by website name or username
- ✅ Sort by recent or A→Z
- ✅ Stats bar (total / secure / weak)
- ✅ Light & Dark theme with localStorage persistence
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Rate limiting + security headers
- ✅ Fully responsive (mobile, tablet, desktop)

## Quick Start

```bash
# 1. Clone or download the project
cd vaultkey

# 2. Set up the backend
cd backend
cp .env.example .env
# → Fill in MONGODB_URI, CLERK_SECRET_KEY, ENCRYPTION_SECRET
npm install
npm run dev     # runs on http://localhost:5000

# 3. Set up the frontend (new terminal)
cd frontend
cp .env.example .env
# → Fill in VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL
npm install
npm run dev     # runs on http://localhost:5173
```

See **SETUP_GUIDE.md** for full MongoDB Atlas setup, Clerk setup, and deployment instructions.

## Project Structure

```
vaultkey/
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Route pages
│       ├── hooks/         # Custom hooks
│       ├── services/      # API calls
│       └── utils/         # Helpers
└── backend/           # Express API
    ├── config/        # DB + env validation
    ├── controllers/   # Route handlers
    ├── middleware/    # Auth middleware
    ├── models/        # Mongoose schemas
    ├── routes/        # Express routes
    └── utils/         # Encryption helpers
```

## Security

- Passwords encrypted with **AES-256-GCM** (random IV per entry, GCM auth tag prevents tampering)
- Encryption key derived from `ENCRYPTION_SECRET` via `scrypt`
- API protected by Clerk JWT verification on every request
- Users can only access their own credentials (userId scoping)
- Rate limiting: 100 requests / 15 minutes per IP
- Helmet.js security headers on all responses

## License

MIT
