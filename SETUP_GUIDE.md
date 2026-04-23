# VaultKey — Complete Setup & Deployment Guide

## 📁 Folder Structure

```
vaultkey/
├── frontend/                   # React + Vite app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PasswordCard.jsx
│   │   │   ├── PasswordModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── StatsBar.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── hooks/
│   │   │   ├── useTheme.js
│   │   │   └── usePasswords.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── passwordUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── backend/                    # Node.js + Express API
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── passwordController.js
    ├── middleware/
    │   └── auth.js
    ├── models/
    │   └── Password.js
    ├── routes/
    │   └── passwordRoutes.js
    ├── utils/
    │   └── encryption.js
    ├── server.js
    └── package.json
```

---

## 🗄️ Step 1 — MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com and create a free account.

2. Click **"Build a Cluster"** → choose **Free tier (M0)** → pick any region.

3. In the left sidebar: **Security → Database Access**
   - Click **"Add New Database User"**
   - Choose **Password** authentication
   - Set username: `vaultkey-user`
   - Set a strong password — save it!
   - Role: **Atlas Admin**

4. In the left sidebar: **Security → Network Access**
   - Click **"Add IP Address"**
   - For development: **"Allow Access From Anywhere"** (0.0.0.0/0)
   - For production: add your Vercel/Render server IPs

5. In the left sidebar: **Deployment → Database**
   - Click **"Connect"** on your cluster
   - Choose **"Drivers"**
   - Copy the connection string — it looks like:
     ```
     mongodb+srv://vaultkey-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add `/vaultkey` before the `?` to set the database name:
     ```
     mongodb+srv://vaultkey-user:YOURPASS@cluster0.xxxxx.mongodb.net/vaultkey?retryWrites=true&w=majority
     ```

6. Paste this as `MONGODB_URI` in your backend `.env`.

---

## 🔐 Step 2 — Clerk Setup

1. Go to https://clerk.com and create a free account.

2. Click **"Add application"**
   - Name: `VaultKey`
   - Enable **Email + Password** sign-in (at minimum)
   - Click **"Create Application"**

3. You'll land on the API Keys page. Copy:
   - **Publishable Key** → goes in frontend `.env` as `VITE_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → goes in backend `.env` as `CLERK_SECRET_KEY`

4. In the Clerk dashboard → **JWT Templates**:
   - The default session token is fine — no changes needed.
   - Clerk automatically issues JWTs your backend can verify with the SDK.

5. For production:
   - Go to **Domains** in Clerk dashboard
   - Add your production frontend URL (e.g. `https://vaultkey.vercel.app`)

---

## ⚙️ Step 3 — Local Development Setup

### Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI, CLERK_SECRET_KEY, ENCRYPTION_SECRET

npm install
npm run dev
# Server runs on http://localhost:5000
```

Generate a strong ENCRYPTION_SECRET (run in Node):
```js
require('crypto').randomBytes(32).toString('hex')
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Fill in VITE_CLERK_PUBLISHABLE_KEY
# Set VITE_API_URL=http://localhost:5000

npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔌 Step 4 — API Reference

All endpoints require `Authorization: Bearer <clerk_jwt>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/passwords` | Get all user credentials |
| POST | `/api/passwords` | Add new credential |
| PUT | `/api/passwords/:id` | Update credential |
| DELETE | `/api/passwords/:id` | Delete credential |
| GET | `/api/health` | Health check |

### POST /api/passwords — Request Body
```json
{
  "websiteName": "GitHub",
  "url": "https://github.com",
  "username": "you@example.com",
  "password": "mySecret123!",
  "notes": "Work account"
}
```

---

## 🚀 Step 5 — Deployment

### Option A: Backend on Render (Recommended — Free Tier)

1. Push your `backend/` folder to a GitHub repo.

2. Go to https://render.com → **New Web Service**
   - Connect your GitHub repo
   - Root directory: `backend` (if monorepo) or root if separate
   - Build command: `npm install`
   - Start command: `node server.js`
   - Environment: **Node**
   - Plan: **Free**

3. In Render → **Environment** tab, add all variables:
   ```
   MONGODB_URI=...
   CLERK_SECRET_KEY=...
   ENCRYPTION_SECRET=...
   FRONTEND_URL=https://your-app.vercel.app
   PORT=10000
   ```

4. Deploy — Render gives you a URL like `https://vaultkey-api.onrender.com`

5. Copy that URL for the next step.

---

### Option B: Backend on Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select your backend repo
3. Add env variables in the Variables tab
4. Railway auto-detects Node.js and deploys

---

### Frontend on Vercel

1. Push your `frontend/` folder to a GitHub repo.

2. Go to https://vercel.com → **Add New Project**
   - Import your frontend repo
   - Framework Preset: **Vite**
   - Root directory: `frontend` (or root if separate repo)

3. In **Environment Variables**, add:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
   VITE_API_URL=https://your-backend.onrender.com
   ```

4. Click **Deploy** — Vercel gives you a URL like `https://vaultkey.vercel.app`

5. Go back to:
   - **Clerk Dashboard → Domains** → add `https://vaultkey.vercel.app`
   - **MongoDB Atlas → Network Access** → add Vercel's IPs (or keep 0.0.0.0/0 for simplicity)
   - **Render/Railway env** → update `FRONTEND_URL` to your Vercel URL

---

## 🔒 Security Notes

### Encryption
- Passwords are encrypted with **AES-256-GCM** before storage
- Each encryption uses a random 16-byte IV — identical passwords produce different ciphertext
- The GCM auth tag prevents tampering
- The encryption key is derived from `ENCRYPTION_SECRET` using `scrypt`

### What's Protected
- ✅ Passwords stored as AES-256-GCM encrypted hex
- ✅ Auth via Clerk JWT — server verifies token signature
- ✅ Ownership check — users can only access their own entries
- ✅ Rate limiting — 100 req/15 min per IP
- ✅ Helmet.js security headers
- ✅ Input validation and length limits

### What's NOT Done (for simplicity)
- ❌ Client-side encryption (zero-knowledge) — passwords decrypt on server
- ❌ 2FA (available via Clerk dashboard — just enable it)

---

## 🐛 Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Missing Clerk Publishable Key` | Add `VITE_CLERK_PUBLISHABLE_KEY` to frontend `.env` |
| `MongoDB connection failed` | Check MONGODB_URI, whitelist your IP in Atlas |
| `Unauthorized. Please sign in.` | Make sure backend has correct `CLERK_SECRET_KEY` |
| `CORS error` | Set `FRONTEND_URL` in backend `.env` to match your frontend origin |
| `ENCRYPTION_SECRET is not set` | Add a 32+ char random string to backend `.env` |
| Blank screen after deploy | Check Vercel build logs; ensure all env vars are set |
| Render sleeps after 15 min | Free tier limitation; upgrade or use Railway |

---

## 🌙 Dark Mode

The app uses Tailwind's `class` strategy for dark mode.

- Toggle is in the Navbar
- Preference saved to `localStorage` under key `vaultkey-theme`
- On first load, system preference is detected via `prefers-color-scheme`
- All components use CSS variables (`--bg-primary`, `--text-primary`, etc.)
  which swap automatically between light/dark classes

---

## 🎨 Theming / Customization

To change the primary color, edit `tailwind.config.js`:
```js
vault: {
  500: '#4361f5',  // Change this to your preferred color
  ...
}
```

Then run `npm run build` to regenerate styles.
