<div align="center">

<img src="frontend/src/assets/logo.svg" alt="Team Task Manager Logo" width="80" height="80" />

# Team Task Manager

**A full-stack collaborative task management platform with role-based access, real-time dashboards, and email-verified authentication.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Railway](https://img.shields.io/badge/Deployed-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-FF6A33?style=for-the-badge)](LICENSE)

[🚀 Live Demo](https://teamtaskmanager-production-5902.up.railway.app) &nbsp;·&nbsp;
[🐛 Report Bug](https://github.com/Khushdil380/TeamTaskManager/issues) &nbsp;·&nbsp;
[💡 Request Feature](https://github.com/Khushdil380/TeamTaskManager/issues)

</div>

---

## 📸 Screenshots

> _Screenshots below — replace with actual images._

| Home Page | Admin Dashboard |
|:---------:|:---------------:|
| ![Home Page](docs/screenshots/home.png) | ![Admin Dashboard](docs/screenshots/admin-dashboard.png) |

| Project View | Task Management |
|:------------:|:---------------:|
| ![Projects](docs/screenshots/projects.png) | ![Tasks](docs/screenshots/tasks.png) |

| Calendar View | Member Dashboard |
|:-------------:|:----------------:|
| ![Calendar](docs/screenshots/calendar.png) | ![Member](docs/screenshots/member-dashboard.png) |

---

## 🎬 Demo Video

> _Replace the link below with your actual demo video._

[![Watch Demo](https://img.shields.io/badge/▶%20Watch%20Demo-FF6A33?style=for-the-badge)](docs/demo.mp4)

---

## ✨ Features

### 🔐 Authentication & Security
- Email + password signup with **OTP email verification** (via Brevo)
- Secure **JWT-based sessions** (7-day expiry)
- **Password reset** via OTP email
- **Professional welcome email** sent automatically after account activation
- Bcrypt password hashing — plaintext passwords never stored
- Protected routes on both frontend and backend

### 👥 Role-Based Access Control
| Capability | Admin | Member |
|---|:---:|:---:|
| Create / edit / delete projects | ✅ | ❌ |
| Assign tasks to team members | ✅ | ❌ |
| Manage team members | ✅ | ❌ |
| View analytics & reports | ✅ | ❌ |
| View assigned tasks | ✅ | ✅ |
| Update task status | ✅ | ✅ |
| View project calendar | ✅ | ✅ |
| Personal "My Tasks" feed | ❌ | ✅ |

### 📊 Dashboard & Analytics
- **Admin dashboard** — project overview, task completion rings, team productivity bar charts, overdue alerts
- **Member dashboard** — personal task stats, priority breakdown, deadline tracker
- Live stats: Total tasks · Completed · In Progress · Overdue

### 📁 Project Management
- Create, edit, and delete projects with title, description, deadline, and status
- Add/remove team members per project
- Project-level progress tracking

### ✅ Task Management
- Create tasks with title, description, assignee, priority (Low / Medium / High), due date, and status
- Status flow: `Todo → In Progress → Review → Completed`
- Overdue detection with visual highlights

### 📅 Calendar View
- Monthly calendar showing all task deadlines across projects
- Role-aware tooltips (admins see project context; members see full status)

### 📱 Responsive Design
- Fully responsive across mobile, tablet, and desktop
- Custom dark theme with `#FF6A33` orange accent — zero third-party UI libraries
- Smooth CSS animations and micro-interactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 5 | Build tool & dev server |
| React Router | v6 | Client-side routing |
| Custom CSS | — | Dark theme design system |
| Tailwind CSS | 3 | Utility classes |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4 | REST API framework |
| Mongoose | 8 | MongoDB ODM |
| JSON Web Token | — | Authentication |
| Bcrypt | — | Password hashing |
| Brevo REST API | — | Transactional email |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Railway | Backend + Frontend hosting |
| GitHub | Source control & CI/CD |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                   │
│              React 18 + Vite + React Router             │
└────────────────────────┬────────────────────────────────┘
                         │  HTTPS  (JWT in Authorization header)
┌────────────────────────▼────────────────────────────────┐
│                   BACKEND (Railway)                     │
│              Express.js REST API (ESM)                  │
│   Auth │ Projects │ Tasks │ Teams │ Dashboard │ Messages│
└────┬───────────────────────────┬────────────────────────┘
     │                           │
┌────▼─────┐             ┌───────▼──────┐
│  MongoDB │             │  Brevo API   │
│  Atlas   │             │  (Email OTP) │
└──────────┘             └──────────────┘
```

---

## 📂 Project Structure

```
TeamTaskManager/
├── frontend/
│   ├── src/
│   │   ├── components/        # All UI components (feature-based folders)
│   │   ├── pages/             # Route-level page components
│   │   ├── context/           # React context (auth, global state)
│   │   ├── services/          # Axios API service layer
│   │   ├── utils/             # Helpers, auth, config
│   │   └── styles/            # Global design system CSS
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    ├── controllers/           # Route handlers (auth, tasks, projects…)
    ├── models/                # Mongoose schemas
    ├── routes/                # Express routers
    ├── middleware/            # JWT auth guard
    ├── services/              # emailService (Brevo)
    ├── utils/                 # password, token, validation helpers
    ├── config/                # DB connection
    └── server.js              # App entry point
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** account (free tier works)
- **Brevo** account for email (free tier: 300 emails/day)

### 1 — Clone the repository

```bash
git clone https://github.com/Khushdil380/TeamTaskManager.git
cd TeamTaskManager
```

### 2 — Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_strong_random_secret
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_verified_sender@gmail.com
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev        # starts on http://localhost:5000
```

### 3 — Frontend setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev        # starts on http://localhost:5173
```

---

## 📡 API Reference

Base URL: `/api`

<details>
<summary><strong>🔐 Auth</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register new user (sends OTP) |
| POST | `/auth/verify-otp` | Verify OTP → activates account + sends welcome email |
| POST | `/auth/login` | Login with email & password |
| POST | `/auth/forgot-password` | Send password reset OTP |
| POST | `/auth/reset-password` | Reset password using OTP |
| POST | `/auth/resend-otp` | Resend OTP to email |
| GET | `/auth/verify-token` | Validate JWT and return user |

</details>

<details>
<summary><strong>📁 Projects</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/projects` | Get all projects (role-filtered) |
| POST | `/projects` | Create project (admin) |
| GET | `/projects/:id` | Get project details |
| PUT | `/projects/:id` | Update project (admin) |
| DELETE | `/projects/:id` | Delete project (admin) |

</details>

<details>
<summary><strong>✅ Tasks</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get tasks for a project |
| POST | `/tasks` | Create task (admin) |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task (admin) |
| GET | `/tasks/my-tasks` | Get current user's assigned tasks |
| GET | `/tasks/calendar` | Get tasks formatted for calendar |

</details>

<details>
<summary><strong>👥 Team & Dashboard</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| GET | `/team` | List team members |
| POST | `/team` | Add member (admin) |
| DELETE | `/team/:id` | Remove member (admin) |
| GET | `/dashboard` | Get dashboard analytics |

</details>

---

## ☁️ Deployment

Both services are deployed on **Railway** with automatic deploys on `git push`.

| Service | Platform | URL |
|---|---|---|
| Frontend | Railway (serve -s dist) | `teamtaskmanager-production-5902.up.railway.app` |
| Backend | Railway (Node.js) | `teamtaskmanager-backend.up.railway.app` |
| Database | MongoDB Atlas | Cloud |

> **Note:** Railway blocks outbound SMTP. This project uses the **Brevo HTTP API** (`https://api.brevo.com/v3/smtp/email`) over HTTPS port 443 to deliver emails reliably.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## 👨‍💻 Author

<div align="center">

**Khushdil Ansari**

[![GitHub](https://img.shields.io/badge/GitHub-Khushdil380-181717?style=for-the-badge&logo=github)](https://github.com/Khushdil380)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF6A33?style=for-the-badge&logo=vercel&logoColor=white)](https://khushdil-ansari-portfolio-frontend.vercel.app/)
[![Email](https://img.shields.io/badge/Email-helpteamtaskmanager@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:helpteamtaskmanager@gmail.com)

_Built as part of the Software Engineer Recruitment Process_

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ and ☕ by [Khushdil Ansari](https://khushdil-ansari-portfolio-frontend.vercel.app/)

⭐ **Star this repo if you found it useful!**

</div>


## 📋 Project Overview

**Project Type:** Full-Stack Web Application  
**Architecture:** 3-Tier (Frontend, Backend, Database)  
**Tech Stack:** React.js, Node.js, MongoDB, JWT, Tailwind CSS

## 🎯 Key Features

✅ User authentication with JWT  
✅ Role-based access control (Admin, Member)  
✅ Project and task management  
✅ Real-time task tracking  
✅ Team collaboration  
✅ Dashboard with insights  
✅ Email notifications  
✅ Responsive UI with modern design

## 🏗️ Project Structure

```
TeamTaskManager/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── context/         # React context for state management
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Images, icons, etc.
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                  # Node.js Express application
│   ├── config/              # Database and configuration
│   ├── models/              # MongoDB schemas
│   ├── controllers/         # Request handlers
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── docs/                     # Documentation
├── PROJECT_STANDARDS.md      # Design and coding standards
├── requrementAndContext.txt  # Project requirements
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** account (Cloud Atlas)
- **Git**

### Installation Steps

#### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/Khushdil380/TeamTaskManager.git
cd TeamTaskManager
\`\`\`

#### 2. Setup Backend

\`\`\`bash
cd backend

# Install dependencies

npm install

# Create .env file from template

cp .env.example .env

# Edit .env with your configuration

# - MONGODB_URI: Your MongoDB connection string

# - JWT_SECRET: A strong random string

# - EMAIL_USER & EMAIL_PASSWORD: Gmail app password

# - FRONTEND_URL: http://localhost:3000

# Start development server

npm run dev
\`\`\`

Backend will run on: \`http://localhost:5000\`

#### 3. Setup Frontend

\`\`\`bash
cd frontend

# Install dependencies

npm install

# Create .env file from template

cp .env.example .env

# Edit .env with your configuration

# - VITE_API_URL: http://localhost:5000/api

# Start development server

npm run dev
\`\`\`

Frontend will run on: \`http://localhost:3000\`

## 🔧 Configuration

### Backend Environment Variables (.env)

\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
SESSION_SECRET=your_session_secret
\`\`\`

### Frontend Environment Variables (.env)

\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
\`\`\`

## 📚 API Documentation

Base URL: \`http://localhost:5000/api\`

### Authentication Endpoints

#### Register User

\`\`\`
POST /auth/signup
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "Password@123"
}
\`\`\`

#### Login User

\`\`\`
POST /auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "Password@123"
}
\`\`\`

## 🎨 Design System

### Color Palette

| Usage         | Color   |
| ------------- | ------- |
| Primary       | #FF6A33 |
| Primary Hover | #E85A26 |
| Success       | #22C55E |
| Warning       | #F59E0B |
| Danger        | #EF4444 |
| Background    | #0F1115 |

### Typography

- **Font Family:** Inter, system-ui, sans-serif
- **Heading XL:** 36px
- **Heading MD:** 24px
- **Body:** 16px
- **Caption:** 12px

### Spacing Scale

xs (4px) → sm (8px) → md (16px) → lg (24px) → xl (32px) → 2xl (48px)

See [PROJECT_STANDARDS.md](PROJECT_STANDARDS.md) for detailed design guidelines.

## 🧪 Testing

\`\`\`bash

# Backend tests

cd backend
npm test

# Frontend tests

cd ../frontend
npm test
\`\`\`

## 📦 Build & Deployment

### Frontend Build

\`\`\`bash
cd frontend
npm run build
\`\`\`

Deploys to Vercel (connect your GitHub repo)

### Backend Deployment

Deploy to Vercel, Heroku, or your preferred hosting service.

## 📝 Code Standards

- Follow the guidelines in [PROJECT_STANDARDS.md](PROJECT_STANDARDS.md)
- Use modular components and services
- Maintain consistent naming conventions
- Write meaningful commit messages
- Keep components focused and reusable

## 🤝 Contributing

1. Create a feature branch (\`git checkout -b feature/feature-name\`)
2. Commit changes (\`git commit -m 'Add feature'\`)
3. Push to branch (\`git push origin feature/feature-name\`)
4. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure database credentials are correct

### CORS Errors

- Verify FRONTEND_URL in backend .env
- Check that frontend and backend ports are correct

### Port Already in Use

\`\`\`bash

# Kill process on port 5000 (Backend)

# On Windows:

netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux:

lsof -i :5000
kill -9 <PID>
\`\`\`

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.

---

**Happy Coding! 🚀**
