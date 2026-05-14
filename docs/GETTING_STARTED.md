# 🚀 Quick Start Guide

Get your Team Task Manager project up and running in 5 minutes!

## Prerequisites

Before you start, make sure you have:

- **Node.js** v16+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Code Editor** (VS Code recommended)

## Step 1️⃣: Clone & Navigate

```bash
# Clone the repo
git clone https://github.com/Khushdil380/TeamTaskManager.git
cd TeamTaskManager
```

## Step 2️⃣: Setup Backend

```bash
cd backend

# Install packages
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your MongoDB URI
# nano .env  (or use your editor)
```

**Required .env variables:**

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=generate-a-random-string-here
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
```

Start backend:

```bash
npm run dev
```

✅ Backend runs at: `http://localhost:5000`

## Step 3️⃣: Setup Frontend (New Terminal)

```bash
cd frontend

# Install packages
npm install

# Create environment file
cp .env.example .env
```

**Required .env variables:**

```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

✅ Frontend runs at: `http://localhost:3000`

## Step 4️⃣: Verify Setup

### ✔️ Check Backend

Open: `http://localhost:5000/api/health`

Should see:

```json
{
  "message": "Server is running",
  "timestamp": "2026-05-14T..."
}
```

### ✔️ Check Frontend

Open: `http://localhost:3000`

Should see the Team Task Manager app loaded

### ✔️ Check Console

No red errors in either terminal? Great! ✅

## Common Quick Fixes

### "Port Already in Use"

```powershell
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### "MongoDB Connection Failed"

- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (Settings → Network Access)
- Add your IP or allow 0.0.0.0/0 for development

### "Tailwind Styles Not Working"

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📁 Project Structure

```
TeamTaskManager/
├── frontend/        → React app (port 3000)
├── backend/         → Node.js API (port 5000)
├── docs/            → Documentation
└── PROJECT_STANDARDS.md → Design guidelines
```

## 📚 Documentation

- **[README.md](../README.md)** - Full project overview
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Complete setup verification
- **[FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)** - Frontend architecture
- **[BACKEND_GUIDE.md](BACKEND_GUIDE.md)** - Backend architecture
- **[API_REFERENCE.md](API_REFERENCE.md)** - API endpoints
- **[PROJECT_STANDARDS.md](../PROJECT_STANDARDS.md)** - Design system

## 🧪 Test Your Setup

### Test Authentication Flow

1. **Open Postman/Insomnia**

2. **Create a user:**
   - POST: `http://localhost:5000/api/auth/signup`
   - Body (JSON):

   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "Password@123"
   }
   ```

3. **Login:**
   - POST: `http://localhost:5000/api/auth/login`
   - Body (JSON):

   ```json
   {
     "email": "john@example.com",
     "password": "Password@123"
   }
   ```

4. **Copy the token from response**

5. **Test protected route:**
   - GET: `http://localhost:5000/api/projects`
   - Header: `Authorization: Bearer <your_token>`

✅ If you get a response, your setup is complete!

## 🎨 Start Building!

### Next Steps:

1. Create your first feature branch
2. Read [PROJECT_STANDARDS.md](../PROJECT_STANDARDS.md)
3. Follow the [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) and [BACKEND_GUIDE.md](BACKEND_GUIDE.md)
4. Implement features following the design system

### Useful Commands:

**Frontend:**

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Check code quality
```

**Backend:**

```bash
npm run dev      # Start with auto-reload
npm start        # Start production
npm test         # Run tests
```

## 🆘 Need Help?

- Check [troubleshooting](../README.md#-troubleshooting) section
- Review documentation files
- Check console for error messages
- Verify all .env variables

## 🎯 Checklist

- [ ] All prerequisites installed
- [ ] Backend running on 5000
- [ ] Frontend running on 3000
- [ ] Health check passed
- [ ] Auth test successful
- [ ] No console errors

---

**🎉 Congratulations! Your project is ready for development!**

Start coding with confidence! 🚀

---

**Quick Links:**

- [GitHub Repo](https://github.com/Khushdil380/TeamTaskManager)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Vite Docs](https://vitejs.dev)
- [Express Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Mongoose Docs](https://mongoosejs.com)
