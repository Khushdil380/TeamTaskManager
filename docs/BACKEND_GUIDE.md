# Backend Development Guide

## Project Setup

This project uses Express.js as the web framework and MongoDB for the database.

## Folder Structure Guide

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection
│
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   └── Task.js
│
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── projectController.js
│   └── taskController.js
│
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   └── taskRoutes.js
│
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── services/            # Business logic
│   ├── emailService.js
│   └── notificationService.js
│
├── utils/               # Utility functions
│   ├── tokenUtils.js
│   ├── passwordUtils.js
│   └── validationUtils.js
│
├── server.js            # Entry point
├── package.json
└── .env                 # Environment variables
```

## Creating a New Feature

### 1. Define MongoDB Model

```js
// models/Feature.js
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Feature", featureSchema);
```

### 2. Create Controller

```js
// controllers/featureController.js
import Feature from "../models/Feature.js";

export const getFeatures = async (req, res) => {
  try {
    const features = await Feature.find();
    res.status(200).json({
      success: true,
      data: features,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createFeature = async (req, res) => {
  try {
    const feature = new Feature(req.body);
    await feature.save();
    res.status(201).json({
      success: true,
      data: feature,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

### 3. Define Routes

```js
// routes/featureRoutes.js
import express from "express";
import {
  getFeatures,
  createFeature,
} from "../controllers/featureController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getFeatures);
router.post("/", authMiddleware, createFeature);

export default router;
```

### 4. Register Routes in server.js

```js
import featureRoutes from "./routes/featureRoutes.js";

app.use("/api/features", featureRoutes);
```

## Authentication Flow

### Using Auth Middleware

```js
import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/protected", authMiddleware, (req, res) => {
  // req.userId contains the authenticated user ID
  res.json({ userId: req.userId });
});
```

### Token Utilities

```js
import { generateToken, verifyToken } from "../utils/tokenUtils.js";

// Generate token
const token = generateToken(userId);

// Verify token
const decoded = verifyToken(token);
```

## Password Security

```js
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";

// Hash password on signup
const hashedPassword = await hashPassword(password);

// Compare on login
const isValid = await comparePassword(password, hashedPassword);
```

## Input Validation

```js
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
} from "../utils/validationUtils.js";

if (!validateEmail(email)) {
  return res.status(400).json({ message: "Invalid email" });
}

if (!validatePassword(password)) {
  return res.status(400).json({ message: "Password too weak" });
}
```

## Development Scripts

```bash
# Start dev server with nodemon
npm run dev

# Start production server
npm start
```

## Environment Variables

Required in .env file:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

## Testing Endpoints

### Using Postman/Insomnia

1. Set base URL to `http://localhost:5000/api`
2. For protected routes, add header:
   ```
   Authorization: Bearer <token>
   ```

### Example: Test Authentication

1. POST to `/auth/signup`

   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "Password@123"
   }
   ```

2. Copy token from response
3. Use token in Authorization header for subsequent requests

## Error Handling

### Standard Error Response

```js
res.status(400).json({
  success: false,
  message: "Error message",
  error: process.env.NODE_ENV === "development" ? error.message : "Error",
});
```

## Common Issues

### MongoDB Connection Failed

- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct

### CORS Errors

- Verify FRONTEND_URL in .env
- Check CORS configuration in server.js

### Token Expiration

- Tokens expire in 7 days
- Client needs to refresh/re-login

## Performance Tips

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Use async/await for cleaner code

---

See [../PROJECT_STANDARDS.md](../PROJECT_STANDARDS.md) for coding guidelines.
