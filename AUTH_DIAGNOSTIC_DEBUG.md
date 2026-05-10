# 🔍 Authentication Issues - Diagnostic Guide

## Quick Fixes to Try (In Order)

### Step 1: Verify MongoDB Connection
Run this in backend terminal:
```bash
cd backend
npm start
```

**Look for these messages:**
- ✅ `✅ Server running on port 5000`
- ✅ `MongoDB Connected: ...`

If you DON'T see MongoDB Connected, the database is not responding:
```bash
# Check your .env file again
cat .env | grep MONGO_URI
```

**SOLUTION**: MongoDB Atlas might be:
- Connection string expired
- IP whitelist issue (add `0.0.0.0/0` in MongoDB Atlas Network Access)
- Wrong password in connection string

---

### Step 2: Test Backend API Directly (No Frontend)
```bash
# Test Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Test Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  }
}
```

If you get `Cannot POST /api/auth/register`, the backend isn't running.
If you get an error with `MONGO_URI`, your database connection is the problem.

---

### Step 3: Verify Frontend Can Reach Backend

**In frontend terminal**, test the proxy:
```bash
cd frontend
npm start
```

**Then try this in browser console (F12):**
```javascript
// Test the proxy
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
})
.then(r => r.json())
.then(data => console.log(data))
.catch(err => console.error(err))
```

**Expected**: Should see response (success or error from backend)
**If CORS error**: setupProxy.js isn't working

---

## Root Causes & Solutions

### Cause 1: MongoDB Connection Failed ❌
**Symptoms:**
- Backend starts but no "MongoDB Connected" message
- User.findOne() fails silently

**Fix:**
```bash
# 1. Reset your Mongo cluster password in MongoDB Atlas
# 2. Update .env with new connection string
# 3. Restart backend
```

---

### Cause 2: Environment Variables Not Loading ❌
**Symptoms:**
- JWT_SECRET is undefined (token generation fails)
- MongoDB URI is undefined

**Fix in backend/server.js - Line 1-2:**
```bash
# Add this logging line to debug:
import dotenv from "dotenv";
dotenv.config();
console.log("🔐 JWT_SECRET loaded:", !!process.env.JWT_SECRET);
console.log("📊 MongoDB URI loaded:", !!process.env.MONGO_URI);
```

---

### Cause 3: Response Status Code Issue ❌
**Problem:** Login endpoint doesn't set status code (defaults to 500 in error case)

**Fix in backend/controllers/authController.js - Line 54:**
```javascript
// BEFORE (Line 54):
res.json({

// AFTER:
res.status(200).json({
```

Add this one-line fix:

---

## Complete Diagnostic Test

Run this file in the backend directory to test everything:

**Create `test-auth.js`:**
```javascript
import User from './models/User.js';
import connectDB from './config/db.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB().then(async () => {
  try {
    // Test 1: Create a test user
    const testUser = await User.create({
      name: 'Diagnostic Test',
      email: 'diag-test@example.com',
      password: await bcryptjs.hash('password123', 10)
    });
    console.log('✅ User created:', testUser.email);

    // Test 2: Find user by email
    const found = await User.findOne({ email: 'diag-test@example.com' });
    console.log('✅ User found:', found.email);

    // Test 3: Verify password
    const match = await bcryptjs.compare('password123', found.password);
    console.log('✅ Password match:', match);

    // Test 4: Generate token
    const token = jwt.sign(
      { id: found._id, role: found.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    console.log('✅ Token generated:', token.substring(0, 20) + '...');

    // Cleanup
    await User.deleteOne({ email: 'diag-test@example.com' });
    console.log('✅ Test complete - all systems working!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  process.exit(0);
});
```

**Run it:**
```bash
cd backend
node test-auth.js
```

---

## Checklist

- [ ] Backend running (npm start in backend folder)
- [ ] MongoDB showing "Connected" message in backend logs
- [ ] Frontend running (npm start in frontend folder)
- [ ] Direct curl test to `/api/auth/register` works
- [ ] Browser console fetch test gets response (not CORS error)
- [ ] Login/Register page shows actual error message (not just "Login failed")

---

## Next Steps

Once you identify which check fails:

1. **MongoDB connection fails** → Fix MongoDB Atlas IP whitelist
2. **curl test fails** → Check environment variables
3. **CORS error in browser** → Restart frontend with `npm start`
4. **Still getting "Login failed"** → Share the exact error from F12 console

