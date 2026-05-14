# Frontend Development Guide

## Project Setup

This project uses Vite as the build tool and Tailwind CSS for styling.

## Folder Structure Guide

```
frontend/src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Common/         # Common/shared components
│   ├── Dashboard/      # Dashboard components
│   └── Projects/       # Project-related components
│
├── pages/              # Full page components (routes)
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Projects.jsx
│
├── services/           # API service functions
│   ├── authService.js
│   ├── projectService.js
│   └── taskService.js
│
├── context/            # React Context for state management
│   ├── AuthContext.jsx
│   └── ProjectContext.jsx
│
├── utils/              # Utility functions
│   ├── formatDate.js
│   └── validateForm.js
│
├── assets/             # Images, icons, fonts
│   └── images/
│
├── App.jsx             # Main app component
├── App.css             # App styles
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Component Creation Standards

### File Naming

- Components: PascalCase (e.g., `UserCard.jsx`)
- Utilities: camelCase (e.g., `formatDate.js`)
- CSS files: match component name (e.g., `UserCard.css`)

### Component Template

```jsx
import React, { useState, useEffect } from "react";
import "./ComponentName.css";

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState("");

  useEffect(() => {
    // Side effects
  }, []);

  return <div className="component-container">{/* JSX content */}</div>;
};

export default ComponentName;
```

## Tailwind CSS Usage

### Color Classes (from tailwind.config.js)

```jsx
<button className="bg-primary text-text-primary hover:bg-primary-hover">
  Click Me
</button>

<div className="bg-bg-card border border-border-primary rounded-card">
  Card Content
</div>
```

### Responsive Design

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
  {/* Responsive grid */}
</div>
```

## State Management

### Using React Context

```jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Component = () => {
  const { user, login } = useContext(AuthContext);

  return <div>{user.name}</div>;
};
```

## API Service Integration

### Service File Example

```js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  signup: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  },
};
```

## Development Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Browser DevTools

- React Developer Tools extension
- Check Network tab for API calls
- Monitor state changes in React DevTools

## Common Issues

### Tailwind Styles Not Working

- Ensure tailwind.config.js is properly configured
- Check that CSS file imports are included
- Restart dev server after config changes

### API Calls Failing

- Verify backend is running on port 5000
- Check VITE_API_URL in .env
- Look at Network tab in DevTools

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`

---

See [../PROJECT_STANDARDS.md](../PROJECT_STANDARDS.md) for design guidelines.
