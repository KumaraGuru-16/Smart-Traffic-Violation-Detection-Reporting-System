# 🛠️ QUICK FIX - Authentication Issues

## 3 Most Common Problems & Solutions

### ❌ Problem 1: "Cannot connect to MongoDB"
**How to fix:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **SECURITY → Network Access**
3. Click **"EDIT"** on the whitelist entry
4. Change IP from specific IP to **`0.0.0.0/0`** (allows all IPs)
5. Click **CONFIRM**
6. Restart your backend:
```bash
cd backend
npm start
```

**Verify it works:** You should see:
```
✅ Server running on port 5000
📊 MongoDB Connected: ac-aahcaxr-shard-00-00.cpouuh5.mongodb.net
```

---

### ❌ Problem 2: "Frontend can't reach backend (CORS error)"
**How to fix:**

1. Make sure **backend is running** on port 5000:
```bash
cd backend
npm start
```

2. In a **NEW terminal**, start frontend on port 3000:
```bash
cd frontend
npm start
```

3. Open browser **F12 console** and check for errors
4. If you see `CORS error`, restart frontend:
```bash
# Stop with Ctrl+C
npm start
```

---

### ❌ Problem 3: "Login/Register returns 'Login failed'"
**How to fix:**

1. **Check browser console (F12)** for the actual error message
2. **Check backend terminal** for error logs (now shows 🔴 error details)
3. Most likely causes:
   - ✅ **MongoDB not connected** → Follow Problem 1 fix
   - ✅ **Backend not running** → Run `npm start` in backend folder
   - ✅ **Frontend not connected to backend** → Restart frontend

---

## Step-by-Step Reset (If Nothing Works)

```bash
# Terminal 1: Backend
cd backend
npm start
# Wait for: ✅ Server running on port 5000
# Wait for: 📊 MongoDB Connected

# Terminal 2: Frontend (open NEW terminal)
cd frontend
npm start
# Browser should open at http://localhost:3000
```

**Then test:**
1. Go to http://localhost:3000
2. Click "Create Account"
3. Enter: Name, Email (`test@example.com`), Password (`password123`)
4. Click "Create Account"
5. **Should redirect to Dashboard** ✅

---

## Debug Mode: See Exact Errors

**In backend terminal**, you'll now see detailed errors like:**
```
🔴 Register Error: E11000 duplicate key error collection
🔴 Login Error: Cast to ObjectId failed
```

This tells you exactly what's wrong!

---

## Still Not Working?

Run the diagnostic:
```bash
cd backend
node test-auth.js
```

This will test:
- ✅ MongoDB connection
- ✅ User creation
- ✅ Password hashing
- ✅ JWT token generation

Look for which test fails to identify the root cause!

