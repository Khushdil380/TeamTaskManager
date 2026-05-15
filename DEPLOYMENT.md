# Deploying Team Task Manager on Railway

This guide deploys **two separate Railway services** from the same GitHub repo:
- `backend` — Node.js / Express API
- `frontend` — React / Vite (served via `vite preview`)

---

## Prerequisites

- A [Railway](https://railway.app) account (free tier works)
- The repo pushed to GitHub (`github.com/Khushdil380/TeamTaskManager`)
- MongoDB Atlas cluster ready (connection string at hand)
- Gmail App Password for email OTP

---

## Step 1 — Deploy the Backend

### 1.1 Create a new Railway project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **Deploy from GitHub repo**
3. Authorize Railway and select **TeamTaskManager**

### 1.2 Configure the backend service

1. After the repo is connected, Railway creates one service automatically
2. In the service **Settings → General**:
   - **Root Directory**: `backend`
   - **Service Name**: `backend` (or any name you prefer)
3. Railway reads `backend/railway.json` automatically — no extra build/start commands needed

### 1.3 Add backend environment variables

Go to the service → **Variables** tab and add:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | A long random secret string |
| `EMAIL_SERVICE` | `gmail` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASSWORD` | Gmail App Password |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | *(fill in after Step 2 — see note below)* |

> `PORT` is injected by Railway automatically — do **not** add it.

### 1.4 Deploy & get the backend URL

1. Click **Deploy** — Railway builds and starts the server
2. Once live, go to **Settings → Domains** → click **Generate Domain**
3. Note the URL, e.g. `https://backend-production-xxxx.up.railway.app`
4. Test it: `https://backend-production-xxxx.up.railway.app/api/health` should return `{"message":"Server is running",...}`

---

## Step 2 — Deploy the Frontend

### 2.1 Add a second service to the same project

1. In your Railway project dashboard, click **+ New** → **GitHub Repo**
2. Select the same **TeamTaskManager** repo again

### 2.2 Configure the frontend service

1. In the service **Settings → General**:
   - **Root Directory**: `frontend`
   - **Service Name**: `frontend`
2. Railway reads `frontend/railway.json` automatically

### 2.3 Add frontend environment variables

Go to the service → **Variables** tab and add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Backend URL from Step 1.4, e.g. `https://backend-production-xxxx.up.railway.app` |

> `VITE_API_URL` is a **build-time** variable — Railway bakes it into the built JS bundle during `npm run build`. If you ever change the backend URL, re-deploy the frontend.

### 2.4 Deploy & get the frontend URL

1. Click **Deploy**
2. Go to **Settings → Domains** → **Generate Domain**
3. Note the URL, e.g. `https://frontend-production-xxxx.up.railway.app`

---

## Step 3 — Connect Backend ↔ Frontend (CORS)

1. Go back to the **backend** service → **Variables**
2. Set `FRONTEND_URL` to the frontend URL from Step 2.4:
   ```
   FRONTEND_URL=https://frontend-production-xxxx.up.railway.app
   ```
3. Railway will automatically redeploy the backend with the updated variable

---

## Step 4 — Verify

1. Open `https://frontend-production-xxxx.up.railway.app`
2. Sign up / log in — OTP email should arrive
3. Create a project, assign members, update task statuses

---

## Redeployment

Railway auto-redeploys both services whenever you `git push` to the `main` branch. No manual action needed.

---

## Switching to Vercel (alternative)

If you prefer Vercel for the frontend:

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Framework: **Vite** (auto-detected)
4. Add environment variable: `VITE_API_URL=https://your-backend.up.railway.app`
5. Update `FRONTEND_URL` on the Railway backend to the Vercel URL

The backend stays on Railway. No code changes needed.

---

## Environment Variables Reference

### Backend (`backend/.env.example`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing (use a long random string) |
| `FRONTEND_URL` | ✅ | Frontend origin for CORS |
| `EMAIL_SERVICE` | ✅ | Email provider (`gmail`) |
| `EMAIL_USER` | ✅ | Gmail address for sending OTP emails |
| `EMAIL_PASSWORD` | ✅ | Gmail App Password |
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ❌ | Injected by Railway automatically |

### Frontend (`frontend/.env.example`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend Railway URL (no trailing slash) |
