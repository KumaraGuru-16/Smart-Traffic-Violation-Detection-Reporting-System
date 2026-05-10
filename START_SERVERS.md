# 🚀 Quick Start - Get Everything Running

## One-Minute Setup

### Terminal 1: Start Backend
```bash
cd c:/Users/USER/Desktop/traffic-violation-system/backend
npm install  # First time only
npm start
```

**You should see:**
```
✅ Server running on port 5000
📊 MongoDB Connected: ac-aahcaxr-shard-00-00...
```

❌ If you DON'T see "MongoDB Connected":
- Your database isn't accessible
- **STOP** and fix MongoDB Atlas IP whitelist (see QUICK_FIX_GUIDE.md)

---

### Terminal 2: Start Frontend
```bash
cd c:/Users/USER/Desktop/traffic-violation-system/frontend
npm install  # First time only
npm start
```

**You should see:**
```
Compiled successfully!
Local: http://localhost:3000
```

Browser should open automatically. If not, go to http://localhost:3000

---

## Test Login

1. **Homepage shows** ✅
2. Click **"Create Account"**
3. **Fill in:**
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. **Click "Create Account"**
5. **Should redirect to Dashboard** ✅

---

## If You Get "Registration Failed"

### Check 1: Is Backend Running?
In Terminal 1 (backend), do you see:
```
✅ Server running on port 5000
📊 MongoDB Connected
```

- ✅ YES → Continue to Check 2
- ❌ NO → Backend crashed, check error messages

### Check 2: Is Frontend Connected?
In browser **F12 Console**, run:
```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    password: 'password123'
  })
}).then(r => r.json()).then(d => console.log(d))
```

- ✅ Shows response → Backend is working
- ❌ CORS error → Restart frontend (`npm start`)
- ❌ Network error → Backend not running

### Check 3: Look at Real Error Message
Instead of just "Registration failed":

**In browser F12 Console**, the actual error should be visible. Common ones:
- `"User already exists"` → Use different email
- `"Cast to ObjectId failed"` → MongoDB issue
- Network error → Backend not accessible

---

## Reset Everything (Nuclear Option)

```bash
# Terminal 1: Kill backend (Ctrl+C)
# Terminal 2: Kill frontend (Ctrl+C)

# Kill any remaining processes
taskkill /F /IM node.exe

# Start fresh
cd c:/Users/USER/Desktop/traffic-violation-system

# Backend
start cmd.exe /k "cd backend && npm start"

# Frontend (wait 5 seconds, then)
start cmd.exe /k "cd frontend && npm start"
```

---

## Verify Everything is Working

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Backend API | `curl -X GET http://localhost:5000` | `API running` |
| Frontend | `http://localhost:3000` | Login page loads |
| Auth route | `curl http://localhost:5000/api/auth/login` | Server responds (error OK) |
| Proxy | Browser F12 console: `fetch('/api')` | Network request visible |

---

## Still Stuck?

1. Run the diagnostic: `cd backend && node test-auth.js`
2. Share the error output from backend terminal (look for 🔴)
3. Share the error from browser F12 console
4. These will tell us exactly what's wrong!

