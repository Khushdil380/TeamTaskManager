# Project Setup Checklist

Complete this checklist to ensure your project is properly configured before starting development.

## ✅ Pre-Setup Verification

- [ ] Node.js v16+ installed
- [ ] npm or yarn installed
- [ ] Git installed and configured
- [ ] MongoDB Atlas account created
- [ ] GitHub repository cloned

## ✅ Backend Setup

### Installation

- [ ] Navigate to \`/backend\` folder
- [ ] Run \`npm install\` to install dependencies
- [ ] Create \`.env\` file from \`.env.example\`

### Configuration

- [ ] Add MONGODB_URI (MongoDB Atlas connection string)
- [ ] Generate and add JWT_SECRET (strong random string)
- [ ] Configure EMAIL_USER and EMAIL_PASSWORD
- [ ] Set FRONTEND_URL to \`http://localhost:3000\`
- [ ] Set SESSION_SECRET to a random string
- [ ] Verify all required environment variables

### Verification

- [ ] Run \`npm run dev\` to start backend
- [ ] Check server logs for successful MongoDB connection
- [ ] Test health endpoint: \`GET http://localhost:5000/api/health\`
- [ ] Verify no errors in console

## ✅ Frontend Setup

### Installation

- [ ] Navigate to \`/frontend\` folder
- [ ] Run \`npm install\` to install dependencies
- [ ] Create \`.env\` file from \`.env.example\`

### Configuration

- [ ] Set VITE_API_URL to \`http://localhost:5000/api\`
- [ ] Verify Tailwind CSS is configured (tailwind.config.js exists)
- [ ] Check font imports in vite.config.js

### Verification

- [ ] Run \`npm run dev\` to start frontend
- [ ] Frontend should load at \`http://localhost:3000\`
- [ ] Verify no console errors
- [ ] Check Tailwind styles are applied

## ✅ Database Setup

- [ ] Created MongoDB Atlas account
- [ ] Created cluster
- [ ] Added IP whitelist (or allow all: 0.0.0.0/0)
- [ ] Created database user credentials
- [ ] Generated connection string
- [ ] Copied URI to backend .env

## ✅ Project Structure

- [ ] Folder structure matches documentation
- [ ] All required directories exist:
  - [ ] \`/frontend/src/components\`
  - [ ] \`/frontend/src/pages\`
  - [ ] \`/frontend/src/services\`
  - [ ] \`/backend/models\`
  - [ ] \`/backend/routes\`
  - [ ] \`/backend/controllers\`

## ✅ Design System Implementation

- [ ] Tailwind config includes custom colors
- [ ] Design tokens in tailwind.config.js
- [ ] Global styles in App.css and index.css
- [ ] Font family (Inter) ready to use

## ✅ Version Control

- [ ] GitHub repo initialized
- [ ] .gitignore files in place
- [ ] First commit made
- [ ] Branch protection configured (optional)

## ✅ Documentation

- [ ] README.md completed
- [ ] API_REFERENCE.md reviewed
- [ ] PROJECT_STANDARDS.md available to team
- [ ] Environment variables documented

## ✅ Development Tools

- [ ] VS Code or preferred IDE ready
- [ ] ESLint configured (optional)
- [ ] Prettier configured (optional)
- [ ] Git workflow decided (branching strategy)

## ✅ Testing

- [ ] Postman or Insomnia installed for API testing
- [ ] Test authentication endpoint
- [ ] Test CORS configuration
- [ ] Verify frontend can reach backend

## 🚀 Ready to Start Development!

Once all items are checked, you're ready to:

1. Create feature branches for each task
2. Start implementing features following PROJECT_STANDARDS.md
3. Follow the defined API structure
4. Use the design system for consistent UI

## 📞 Quick Reference

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:5000  
**API Health:** http://localhost:5000/api/health  
**MongoDB Atlas:** https://www.mongodb.com/cloud/atlas

---

**Last Updated:** May 14, 2026  
**Setup Status:** ✅ Ready for Development
