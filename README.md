# Team Task Manager - Full-Stack Web Application

A comprehensive task management system for teams with role-based access control, real-time tracking, and collaborative features.

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
