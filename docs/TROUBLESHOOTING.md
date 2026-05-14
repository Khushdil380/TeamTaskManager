# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### npm install fails

**Problem:** Dependencies won't install  
**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Node version error

**Problem:** "Node version not supported"  
**Solution:**

- Check your Node version: `node -v`
- Update Node.js to v16 or higher
- Download from: https://nodejs.org/

## Backend Issues

### MongoDB Connection Error

**Problem:** "MongooseError: Cannot connect to MongoDB"

**Solutions:**

1. Verify connection string:
   - Check MONGODB_URI in `.env`
   - Ensure it includes username:password

2. Check MongoDB Atlas:
   - Go to https://cloud.mongodb.com
   - Click your cluster
   - Copy connection string
   - Paste into .env

3. Whitelist your IP:
   - Network Access → IP Access List
   - Add your IP or 0.0.0.0/0 for development

4. Test connection:
   ```bash
   npm run dev
   # Should see: ✅ MongoDB connected successfully
   ```

### Port 5000 Already in Use

**Problem:** "Error: listen EADDRINUSE: address already in use :::5000"

**Solutions:**

Windows:

```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Mac/Linux:

```bash
lsof -i :5000
kill -9 <PID>
```

Or change port in server.js and .env

### JWT Token Errors

**Problem:** "Invalid or expired token"

**Solutions:**

1. Generate new JWT_SECRET
2. Re-login to get new token
3. Check token expiration (7 days)

### Email Service Not Working

**Problem:** Email sending fails

**Solutions:**

1. Use Gmail app password (not regular password)
2. Enable "Less secure apps" if using regular Gmail
3. Verify EMAIL_USER and EMAIL_PASSWORD in .env
4. Test with: https://www.google.com/accounts/DisplayUnlockCaptcha

## Frontend Issues

### Port 3000 Already in Use

**Problem:** "error Command failed with exit code 1"

**Solutions:**

Windows:

```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Mac/Linux:

```bash
lsof -i :3000
kill -9 <PID>
```

### Tailwind Styles Not Applied

**Problem:** CSS classes don't work

**Solutions:**

1. Check tailwind.config.js content paths
2. Restart dev server: `npm run dev`
3. Clear Vite cache:
   ```bash
   rm -rf .vite
   npm run dev
   ```
4. Verify postcss.config.js exists

### API Calls Return 404

**Problem:** "Cannot POST /api/..."

**Solutions:**

1. Verify backend is running on 5000
2. Check VITE_API_URL in .env
3. Look at Network tab in DevTools
4. Verify route exists in backend

### CORS Error

**Problem:** "Access to XMLHttpRequest blocked by CORS policy"

**Solutions:**

1. Verify backend .env FRONTEND_URL is correct
2. Check cors() middleware in server.js
3. Restart backend
4. Clear browser cache (Ctrl+Shift+Del)

### React DevTools Show Old State

**Problem:** State changes aren't reflecting

**Solutions:**

1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear site data: DevTools → Application → Clear storage
3. Restart dev server

## Common Issues

### "Module not found" errors

**Problem:** Import paths don't work

**Solutions:**

1. Verify file paths are correct
2. Check file extensions (.jsx, .js, .css)
3. Ensure file exists in correct folder
4. Check for typos in filenames

### TypeScript Errors (if using TypeScript)

**Problem:** Type errors in console

**Solutions:**

1. Install type definitions: `npm install --save-dev @types/...`
2. Check tsconfig.json configuration
3. Verify import paths

### Git Merge Conflicts

**Problem:** Cannot pull/push changes

**Solutions:**

```bash
# See conflicts
git diff

# Resolve manually, then:
git add .
git commit -m "Resolve conflicts"
git push
```

## Performance Issues

### App Loading Slowly

**Problem:** Frontend takes long to load

**Solutions:**

1. Check Network tab for slow requests
2. Verify API responses are fast
3. Optimize bundle size
4. Check database queries

### Backend Response Slow

**Problem:** API endpoints take long

**Solutions:**

1. Check MongoDB query performance
2. Add database indexes
3. Implement caching
4. Monitor server resources

## Database Issues

### Cannot Find Database Collections

**Problem:** Collections empty or missing

**Solutions:**

1. Check you're using correct database name
2. Verify data was actually saved
3. Use MongoDB Compass to inspect
4. Check write permissions

### Duplicate Data

**Problem:** Data duplicated in database

**Solutions:**

1. Add unique constraints in schema
2. Implement validation
3. Check for duplicate POST requests

## Development Workflow Issues

### Changes Not Reflecting

**Problem:** Code changes don't show up

**Solutions:**

1. Restart dev server
2. Clear browser cache
3. Check for syntax errors
4. Check console for compilation errors

### Hot Reload Not Working

**Problem:** Changes require manual refresh

**Solutions:**

1. Ensure webpack/vite is configured for HMR
2. Check file path is correct
3. Restart dev server
4. Check port forwarding if using remote dev

## Deployment Issues

### Build Fails

**Problem:** `npm run build` errors

**Solutions:**

1. Check for TypeScript errors
2. Verify all imports are correct
3. Test locally first
4. Check build logs for errors

### Environment Variables Not Loaded

**Problem:** .env variables undefined

**Solutions:**

1. Create .env (not .env.example)
2. Restart build process
3. Check variable names match usage
4. For Vercel: add to Environment Variables

## Getting More Help

1. **Check error message carefully** - Often points to the issue
2. **Google the error** - Likely someone solved it
3. **Check documentation**:
   - [Vite Docs](https://vitejs.dev/guide/troubleshooting.html)
   - [Express Docs](https://expressjs.com/en/starter/faq.html)
   - [MongoDB Docs](https://docs.mongodb.com/)
4. **Ask in community**:
   - Stack Overflow
   - GitHub Discussions
   - Reddit: r/reactjs, r/node

---

**Still stuck?** Check the full documentation in the `/docs` folder!
