# 🚗 TRAFFIC VIOLATION SYSTEM - TROUBLESHOOTING GUIDE

## ❌ Problem: "Cannot connect to server" Error

This error means the **frontend cannot reach the backend**. Follow these steps to fix it permanently.

---

## 🔧 QUICK FIX (99% of the time)

### Step 1: Make sure Backend is Running
```bash
# Open terminal in the BACKEND folder
cd backend
npm start
```

**Wait for this message:**
```
✅ Server running on port 5000
📍 Visit http://localhost:5000/health to check status
```

### Step 2: Verify Backend is Online
Open this in your browser:
```
http://localhost:5000/health
```

You should see:
```json
{
  "status": "✅ Backend is running",
  "db": "✅ Connected",
  "timestamp": "2026-05-09T..."
}
```

### Step 3: If Still Failing
Check the MongoDB connection:

```bash
# In backend folder, run:
node startup-check.js
```

This will show you:
- ✅ If .env file is loaded
- ✅ If MongoDB connection works
- ✅ If environment variables are correct

---

## 📋 Complete Troubleshooting Steps

### Issue 1: Backend Won't Start (exits immediately)

**Symptoms:**
- Terminal shows error and immediately closes
- "MongoDB Error" or "Failed to start server"

**Solution:**

1. **Check .env file exists** in backend folder:
```bash
ls -la backend/.env
```

Expected output shows the file with size > 0

2. **If .env is missing:**
```bash
# Create from scratch
cat > backend/.env << EOF
PORT=5000
MONGO_URI=mongodb://e0323045_db_user:kumaraguru@ac-aahcaxr-shard-00-00.cpouuh5.mongodb.net:27017,ac-aahcaxr-shard-00-01.cpouuh5.mongodb.net:27017,ac-aahcaxr-shard-00-02.cpouuh5.mongodb.net:27017/Traffic?ssl=true&replicaSet=atlas-9pq8bz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=E0323045
JWT_SECRET=mysupersecretkey
CLOUD_NAME=dqchvizah
CLOUD_API_KEY=731647849686328
CLOUD_API_SECRET=CYTdcr7hYfxjS7TIXA-kQzcVz7U
EOF
```

3. **Check MongoDB Atlas is running:**
   - Go to https://cloud.mongodb.com
   - Login to your account
   - Check if the cluster is "Running" (not stopped/paused)

4. **Check IP Whitelist** for MongoDB:
   - In MongoDB Atlas → Database Access → Network
   - Your IP must be whitelisted
   - If using "@includes your current IP", it may have changed

5. **Test MongoDB directly:**
```bash
# Install mongosh globally if you don't have it
npm install -g mongosh

# Then test connection:
mongosh "mongodb+srv://e0323045_db_user:kumaraguru@ac-aahcaxr-shard-00-00.cpouuh5.mongodb.net/?retryWrites=true&w=majority"
```

---

### Issue 2: MongoDB Connection Fails on Startup

**Symptoms:**
- Startup check says "MongoDB connection failed"
- Network timeout or "getaddrinfo ENOTFOUND"

**Solutions:**

1. **If seeing DNS errors (getaddrinfo ENOTFOUND):**
```bash
# Try forcing DNS in server.js:
# Add this at the top of server.js
process.env.DNS_SERVERS = "8.8.8.8,1.1.1.1";

# Or start it with:
DNS_SERVERS=8.8.8.8,1.1.1.1 npm start
```

2. **Check network connectivity:**
```bash
# Test if you can reach MongoDB servers
ping ac-aahcaxr-shard-00-00.cpouuh5.mongodb.net
```

3. **If you're on VPN/Proxy:**
   - MongoDB Atlas might block your connection
   - Add your actual IP to whitelist (0.0.0.0/0 temporarily for testing)
   - Don't use this in production!

4. **Restart MongoDB Atlas cluster:**
   - In MongoDB Atlas console
   - Click cluster → "Pause" then "Resume"
   - Wait 2 minutes for cluster to come back online

---

### Issue 3: Port 5000 Already in Use

**Symptoms:**
- Error: "Port 5000 is already in use"
- EADDRINUSE

**Solutions:**

#### On Windows:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Or change port - edit backend/.env
PORT=8000  # Change from 5000
```

#### On Mac/Linux:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=8000
```

Then update frontend .env:
```
REACT_APP_API_URL=http://localhost:8000/api
```

---

### Issue 4: Environment Variables Not Loading

**Symptoms:**
- Server starts but says "Cloudinary configured: undefined"
- All requests fail with 500 error

**Solution:**

The moment you start server, it should load .env automatically (it's set up in server.js line 1-2).

If not working:

1. **Verify .env format is correct:**
   - No spaces around `=`
   - No quotes around values
   - Each variable on new line

2. **Force reload npm packages:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

3. **Check file exists and readable:**
```bash
cat backend/.env | head -5
```

---

## 🚀 NEW PERMANENT IMPROVEMENTS (Just Applied)

These changes have been made to prevent login/register failures:

### Backend Improvements ✅
1. **Automatic MongoDB Retry Logic** - Backend now retries MongoDB connection 5 times with exponential backoff instead of crashing
2. **Health Check Endpoint** - `/health` endpoint tells frontend if backend is online
3. **Better Error Messages** - Console logs are now more detailed
4. **Port Conflict Detection** - Clear message if port is already in use

### Frontend Improvements ✅
1. **Backend Health Check on Load** - Login/Register page now checks if backend is online before letting you submit
2. **Better Error Messages** - Shows clear steps if backend isn't running
3. **Auto-retry Detection** - Checks backend status every 5 seconds
4. **Button States** - Shows "⚠️ Backend Not Running" if server is down

---

## 📊 Diagnostic Workflow

When login/register fails:

1. **Is backend running?**
   ```bash
   # Check: Does terminal show "✅ Server running on port 5000" ?
   ```

2. **Is backend actually online?**
   ```bash
   # Visit: http://localhost:5000/health
   # Should show: { "status": "✅ Backend is running" }
   ```

3. **Is MongoDB connected?**
   ```bash
   # Check health endpoint status
   # Should show: "db": "✅ Connected"
   ```

4. **Check console errors in:**
   - Backend terminal (npm start terminal)
   - Frontend console (Open DevTools → Console tab)

5. **Run startup check:**
   ```bash
   node backend/startup-check.js
   ```

---

## 🔧 Advanced Debugging

### Enable Verbose Logging

Edit `backend/server.js` and add:
```javascript
// At the very top, before imports:
process.env.DEBUG = "*";
```

Or from command line:
```bash
DEBUG=* npm start
```

### View MongoDB Queries

Install MongoDB logging package:
```bash
cd backend
npm install mongoose-debug
```

Then add to server.js after mongoose connect:
```javascript
if (process.env.DEBUG_DB) {
  mongoose.set("debug", true);
}
```

Run with:
```bash
DEBUG_DB=true npm start
```

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try to login
4. Look for failed requests:
   - Should see POST to `http://localhost:5000/api/auth/login`
   - If seeing "Connection refused" = backend not running
   - If seeing 500 error = backend running but request failed

---

## ✅ Final Verification Checklist

- [ ] Backend terminal shows "✅ Server running on port 5000"
- [ ] `http://localhost:5000/health` returns status json
- [ ] Frontend can see the backend is running (button not grayed out)
- [ ] MongoDB Atlas cluster is "Running" status
- [ ] .env file exists and is readable
- [ ] No port conflicts (no other process on :5000)
- [ ] Can login/register successfully

---

## 🆘 Still Having Issues?

If the above doesn't work:

1. **Completely restart everything:**
```bash
# Kill everything
# Close all terminals
# Close browser
# Wait 10 seconds

# Remove database connection (fresh DB)
# In MongoDB Atlas → Delete & Recreate collection

# Start fresh
npm install  # in both backend and frontend
npm start    # in backend
npm run dev  # in frontend
```

2. **Nuclear option - Reset project:**
```bash
# Backup your work first!
git status
git stash  # Save uncommitted changes if any

# Hard reset to latest clean state
git reset --hard origin/main
npm install
npm start
```

3. **Check for corrupted node_modules:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📞 Still Stuck?

Check these files for errors:
- `backend/server.js` - Check console output when starting
- `backend/config/db.js` - MongoDB connection logs
- `frontend/src/services/api.js` - API configuration
- Browser Console (F12) - Frontend errors

Open an issue with:
- Full error message from backend terminal
- Output of `node backend/startup-check.js`
- Screenshot of browser Network tab showing failed request

---

**Last Updated:** May 9, 2026
**Version:** 2.0 (With Auto-Retry and Health Check)
