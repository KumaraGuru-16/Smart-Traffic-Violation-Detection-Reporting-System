# 🚨 Traffic Violation System

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18+-43853d?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-13aa52?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2+-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()

A comprehensive full-stack web application for reporting and managing traffic violations with real-time map visualization, admin dashboard, and role-based access control.

[Live Demo](#) • [Documentation](#) • [Report Bug](https://github.com/yourname/traffic-violation-system/issues) • [Request Feature](https://github.com/yourname/traffic-violation-system/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The **Traffic Violation System** is an intelligent web platform designed to streamline the process of reporting traffic violations. Users can submit violation reports with photo evidence and location details, while administrators can review, validate, and manage these reports through an interactive dashboard with map visualization.

### Key Highlights
- ✅ **Full-Stack Application** - Modern frontend with React and Express backend
- ✅ **Real-Time Map Integration** - Leaflet maps with color-coded violation markers
- ✅ **Cloud Storage** - Image uploads via Cloudinary
- ✅ **Secure Authentication** - JWT-based authentication with role-based access
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- ✅ **Production Ready** - Error handling, validation, and security best practices

---

## ✨ Features

### 👤 User Features
- **User Authentication**
  - Register with email and password
  - Secure login with JWT tokens
  - Session management
  - Password hashing with bcrypt

- **Report Management**
  - Submit traffic violation reports with images
  - Capture violation details: location, description, photo evidence
  - View personal report history
  - Track report approval status (Pending/Approved/Rejected)
  - Delete personal reports

- **User Dashboard**
  - Overview of submitted reports
  - Statistics and quick actions
  - Navigation to report form and personal reports

### 🛡️ Admin Features
- **Admin Dashboard**
  - View all submitted reports
  - Interactive map with color-coded markers
    - 🟢 Green: Approved reports
    - 🔴 Red: Rejected reports
    - 🟡 Yellow: Pending reports
  - Toggle between map view and card view
  - Quick status updates (Approve/Reject)
  - Detailed report inspection panel

- **Report Management**
  - Review violation reports with full details
  - Update report status and manage approvals
  - View reporter information
  - Access report metadata (timestamps, location coordinates)

### 🔐 Security Features
- JWT-based authentication
- Protected routes (Private Route component)
- Role-based access control (User/Admin)
- Admin middleware for privileged operations
- Secure password hashing
- CORS configuration for cross-origin requests

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime environment | Latest |
| **Express.js** | Web framework | v5.2+ |
| **MongoDB** | NoSQL Database | Cloud Atlas |
| **Mongoose** | ODM for MongoDB | v9.4+ |
| **JWT** | Authentication | v9.0+ |
| **bcryptjs** | Password hashing | v3.0+ |
| **Cloudinary** | Cloud image storage | v1.41+ |
| **CORS** | Cross-origin requests | v2.8+ |
| **dotenv** | Environment variables | v17.4+ |
| **Multer** | File upload handling | v2.1+ |
| **Nodemon** | Development auto-reload | v3.1+ |

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI framework | v19+ |
| **React Router** | Client-side routing | v7.14+ |
| **Axios** | HTTP client | v1.16+ |
| **Leaflet** | Mapping library | v1.9+ |
| **React-Leaflet** | React wrapper for Leaflet | v5.0+ |
| **Tailwind CSS** | Styling framework | Latest |
| **React Scripts** | Build tools | v5.0+ |
| **PostCSS** | CSS processing | v8.5+ |

### DevOps & Services
- **Cloudinary** - Image storage and optimization
- **MongoDB Atlas** - Cloud database hosting
- **Git/GitHub** - Version control

---

## 📁 Project Structure

```
traffic-violation-system/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary configuration
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   └── reportController.js    # Report CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   ├── adminMiddleware.js     # Admin authorization
│   │   ├── upload.js              # Cloudinary upload setup
│   │   └── uploadMiddleware.js    # Multer configuration
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── report.js              # Report schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── reportRoutes.js        # Report endpoints
│   ├── services/
│   │   └── cloudinaryService.js   # Cloudinary utilities
│   ├── uploads/                   # Temporary upload storage
│   ├── .env                       # Environment variables
│   ├── server.js                  # Express server setup
│   └── package.json               # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Dashboard.js       # User dashboard
│   │   │   ├── AdminDashboard.js  # Admin dashboard with map
│   │   │   ├── ReportForm.js      # Report submission form
│   │   │   └── MyReports.js       # User's reports list
│   │   ├── components/
│   │   │   ├── PrivateRoute.js    # Protected route wrapper
│   │   │   └── AdminMap.js        # Interactive map component
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # React entry point
│   ├── public/                    # Static assets
│   ├── tailwind.config.js         # Tailwind configuration
│   ├── postcss.config.js          # PostCSS configuration
│   ├── setupProxy.js              # Development proxy setup
│   └── package.json               # Dependencies
│
├── QUICK_START.sh                 # Automated setup script
├── AUTH_FIX_COMPLETE.md           # Authentication fixes documentation
├── MAP_FEATURES_UPGRADE.md        # Map features documentation
├── README.md                      # This file
└── package.json                   # Root package.json
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v18.0 or higher ([Download](https://nodejs.org/))
- **npm** v9.0+ or **yarn** (comes with Node.js)
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Cloudinary Account** ([Sign up free](https://cloudinary.com/))
- **Git** for version control

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourname/traffic-violation-system.git

# Navigate to project directory
cd traffic-violation-system
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy template and fill values)
cp .env.example .env

# Start backend server
npm start
# or for development with auto-reload
npm run dev
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Quick Start with Bash Script

Alternatively, use the automated setup script:

```bash
# From project root
chmod +x QUICK_START.sh
./QUICK_START.sh
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/traffic_db?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Environment
NODE_ENV=development
```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Get connection string
5. Replace `username`, `password`, and `cluster` in `MONGO_URI`

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Get your Cloud Name, API Key, and API Secret
4. Add to `.env` file

### Frontend Configuration

The frontend uses a proxy setup for development:

- **Development**: Requests to `/api/*` are proxied to `http://localhost:5000`
- **Production**: Update API base URL in `frontend/src/services/api.js`

---

## 📖 Usage

### For Users

#### 1. Register a New Account
- Navigate to the Register page
- Fill in: Name, Email, Password
- Click "Create Account"
- Automatically logged in and redirected to dashboard

#### 2. Submit a Traffic Violation Report
- Click "Report" in navigation
- Fill in report details:
  - **Description**: Details about the violation
  - **Location**: Street name and nearby landmarks (e.g., "Main Street intersection, near red traffic light")
  - **Image**: Upload photo evidence of the violation
- Click "Submit Report"
- Report appears in "My Reports" with status: **Pending**

#### 3. View Your Reports
- Go to "My Reports"
- See all your submitted reports
- View status: Pending → Approved or Rejected
- Delete personal reports (optional)

### For Administrators

#### 1. Access Admin Dashboard
- Login with admin account
- Click "Admin Dashboard" in navigation
- View interactive map with violation locations

#### 2. Review Reports on Map
- **Map View**:
  - 🟢 Green markers = Approved reports
  - 🔴 Red markers = Rejected reports
  - 🟡 Yellow markers = Pending reports

- Click marker to see report preview
- Click report card to open full details panel

#### 3. Manage Report Status
- Open report details panel
- Click "Approve" or "Reject" button
- Confirm action
- Status updates immediately on map

#### 4. Toggle Views
- Switch between **Map View** and **Card View**
- Map View: Geographic visualization
- Card View: Tabular list format

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Report Endpoints

#### Create Report
```http
POST /reports
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "description": "Speeding vehicle in school zone",
  "location": "Oak Street School [40.7128,-74.0060]",
  "image": <binary_file>
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": "507f1f77bcf86cd799439012",
  "description": "Speeding vehicle in school zone",
  "location": "Oak Street School [40.7128,-74.0060]",
  "image": "https://cloudinary.com/...",
  "status": "pending",
  "createdAt": "2024-05-06T10:30:00.000Z"
}
```

#### Get User's Reports
```http
GET /reports/my
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "description": "Speeding vehicle in school zone",
    "location": "Oak Street School [40.7128,-74.0060]",
    "status": "pending",
    "image": "https://cloudinary.com/..."
  }
]
```

#### Get All Reports (Admin Only)
```http
GET /reports
Authorization: Bearer <admin_token>
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "description": "Speeding vehicle in school zone",
    "location": "Oak Street School [40.7128,-74.0060]",
    "status": "pending",
    "image": "https://cloudinary.com/..."
  }
]
```

#### Update Report Status (Admin Only)
```http
PUT /reports/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved"
}
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "approved",
  "message": "Report status updated successfully"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

#### 401 Unauthorized
```json
{
  "message": "Not authorized"
}
```

#### 403 Forbidden
```json
{
  "message": "Only admins can access this route"
}
```

#### 500 Server Error
```json
{
  "error": "Server error"
}
```

---

## 📊 Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "admin"], default: "user"),
  createdAt: Date,
  updatedAt: Date
}
```

### Report Model

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: "User", required),
  image: String (Cloudinary URL),
  description: String,
  location: String (format: "Location Name [lat,lon]"),
  status: String (enum: ["pending", "approved", "rejected"], default: "pending"),
  createdAt: Date,
  updatedAt: Date
}
```

### Database Indexes

- `User.email` (unique index)
- `Report.user` (index for query optimization)
- `Report.status` (index for filtering)
- `Report.createdAt` (index for sorting)

---

## 🏗️ Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  Login → Register → Dashboard → ReportForm → MyReports → Admin   │
└────────────────────┬────────────────────────────────────────────┘
                     │ Axios HTTP Requests
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express.js)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            API Routes & Controllers                      │   │
│  │  /api/auth → authController (Register, Login)           │   │
│  │  /api/reports → reportController (CRUD operations)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Middleware Layer                                │   │
│  │  authMiddleware → JWT Verification                       │   │
│  │  adminMiddleware → Admin Authorization                   │   │
│  │  upload → Multer + Cloudinary Integration                │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬───────────────────────────┬─────────────────────────┘
             │                           │
             ↓                           ↓
    ┌──────────────────┐       ┌──────────────────┐
    │   MongoDB Atlas  │       │   Cloudinary     │
    │  (User & Report  │       │  (Image Storage) │
    │     Data)        │       │                  │
    └──────────────────┘       └──────────────────┘
```

### Authentication Flow

```
User Input → Frontend → POST /api/auth/register
                              ↓
                         authController
                              ↓
                    Hash Password (bcrypt)
                              ↓
                    Save to MongoDB
                              ↓
                    Generate JWT Token
                              ↓
                    Return Token to Frontend
                              ↓
                    Store in LocalStorage
                              ↓
                    Include in Protected Routes
```

### Report Submission Flow

```
User Input → Frontend Form → POST /api/reports
                                    ↓
                             authMiddleware
                             (Verify JWT)
                                    ↓
                             upload.js
                             (Multer Setup)
                                    ↓
                             uploadMiddleware
                             (Cloudinary)
                                    ↓
                             reportController
                             (Create in DB)
                                    ↓
                             Return Report with
                             Image URL
```

---

## 🌍 Deployment

### Backend Deployment (Node.js Hosting)

#### Option 1: Railway
1. Connect GitHub repository
2. Select backend directory
3. Add environment variables
4. Deploy

#### Option 2: Heroku
1. Create Heroku app
2. Connect Git repository
3. Set environment variables
4. Deploy: `git push heroku main`

#### Option 3: DigitalOcean / AWS EC2
1. Create server instance
2. Install Node.js
3. Clone repository
4. Install dependencies: `npm install`
5. Start with PM2: `pm2 start server.js --name "tvs-backend"`

### Frontend Deployment (React)

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Option 2: Netlify
```bash
# Build
cd frontend
npm run build

# Connect build folder to Netlify
```

#### Option 3: GitHub Pages
```bash
npm run build
# Deploy build folder to GitHub Pages
```

### Environment Configuration for Production

**Backend (.env)**:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=<production_mongodb_uri>
JWT_SECRET=<long_random_secret>
CLOUD_NAME=<cloudinary_name>
CLOUD_API_KEY=<api_key>
CLOUD_API_SECRET=<api_secret>
```

**Frontend (update api.js)**:
```javascript
const API = axios.create({
  baseURL: "https://your-domain.com/api"
});
```

---

## 🔍 Troubleshooting

### Backend Issues

#### MongoDB Connection Failed
```
Error: Cannot connect to MongoDB
```

**Solution**:
1. Verify `MONGO_URI` in `.env` is correct
2. Check MongoDB Atlas IP whitelist (add your IP)
3. Verify database credentials
4. Check internet connection
```bash
# Test connection
mongo "mongodb+srv://..."
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm start
```

#### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:
1. Check backend CORS configuration in `server.js`
2. Verify frontend URL is whitelisted
3. Check `setupProxy.js` in frontend

### Frontend Issues

#### "Failed to fetch" Error
```
Network error: Failed to fetch
```

**Solution**:
1. Verify backend is running on port 5000
2. Check browser console (F12) for CORS errors
3. Verify API base URL in `src/services/api.js`
4. Clear browser cache and restart dev server

#### Login/Register Not Working
1. Check backend server logs for errors
2. Verify MongoDB connection
3. Test with cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Images Not Uploading
```
Error: Image upload failed
```

**Solution**:
1. Verify Cloudinary credentials in `.env`
2. Check file size limits (max 5MB recommended)
3. Verify MIME type (jpg, png, gif allowed)
4. Check Cloudinary dashboard for error logs

### Common Fixes

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reset database (caution)
# Delete all collections in MongoDB Atlas

# Restart both servers
# Terminal 1: cd backend && npm start
# Terminal 2: cd frontend && npm start
```

---

## ❓ FAQ

### General Questions

**Q: Is this production-ready?**
A: The core features are production-ready, but you should:
- Add rate limiting
- Implement additional security headers
- Add comprehensive logging
- Set up monitoring and alerts
- Perform security testing (OWASP)

**Q: Can I customize the map styling?**
A: Yes! Leaflet is highly customizable. Edit `components/AdminMap.js` to:
- Change marker icons
- Modify map style
- Add different tile providers
- Implement custom popups

**Q: How do I add email notifications?**
A: Integrate services like:
- SendGrid (recommended)
- Mailgun
- AWS SES
Add email service in `reportController.js` when status changes

### Technical Questions

**Q: How do I add more admin users?**
A: Currently, admins must be created via database update:
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Q: Can I use a different database?**
A: Yes, the code uses Mongoose which supports:
- MongoDB (current)
- MariaDB (via adapter)
- PostgreSQL (via adapter)

**Q: How do I implement real-time updates?**
A: Add WebSockets using Socket.IO:
```bash
npm install socket.io
npm install socket.io-client
```

**Q: What's the max file upload size?**
A: Currently limited to 5MB by Cloudinary. Adjust in `uploadMiddleware.js`:
```javascript
limits: { fileSize: 10 * 1024 * 1024 } // 10MB
```

### Deployment Questions

**Q: How do I backup my database?**
A: MongoDB Atlas includes:
- Automated daily backups
- Point-in-time restore
- Manual snapshots available

**Q: What about SSL/HTTPS?**
A: Most deployment platforms (Vercel, Netlify, Railway) provide free SSL. For self-hosted, use:
- Certbot + Let's Encrypt
- Cloudflare (free plan available)

**Q: How do I monitor the application?**
A: Use services like:
- Sentry (error monitoring)
- LogRocket (session replay)
- Datadog (infrastructure monitoring)
- New Relic (performance monitoring)

---

## 🤝 Contributing

We welcome contributions! Here's how:

### Development Process

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourname/traffic-violation-system.git
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

4. **Commit changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe changes clearly
   - Link related issues
   - Request review from maintainers

### Code Style Guidelines

- **JavaScript**: Use ES6+ syntax
- **Components**: Functional components with hooks
- **Variable naming**: camelCase for variables, PascalCase for components
- **Comments**: Explain "why", not "what"
- **Testing**: Write tests for new features

### Commit Message Format

```
type: subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat: add email notifications for report status changes

- Integrate SendGrid for email service
- Add email templates for approval/rejection
- Add retry logic for failed emails

Closes #123
```

### Testing

Before submitting PR:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourprofile](https://github.com/yourprofile)
- Email: your.email@example.com
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- [Leaflet](https://leafletjs.com/) - Interactive maps
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://react.dev/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Support

Need help? Here are your options:

- 📖 **Documentation**: Read through this README and linked docs
- 🐛 **Found a bug?** [Report it](https://github.com/yourname/traffic-violation-system/issues)
- 💡 **Feature request?** [Suggest it](https://github.com/yourname/traffic-violation-system/issues)
- 💬 **Questions?** Open a [discussion](https://github.com/yourname/traffic-violation-system/discussions)

---

## 🗺️ Roadmap

### Current Version (v1.0.0)
- ✅ User authentication
- ✅ Report submission
- ✅ Admin dashboard with maps
- ✅ Image upload to cloud

### Planned (v1.1.0)
- [ ] Email notifications for status changes
- [ ] Two-factor authentication
- [ ] Report analytics dashboard
- [ ] Advanced filtering and search
- [ ] Report export (PDF)

### Future (v2.0.0)
- [ ] Mobile app (React Native)
- [ ] Real-time chat with admins
- [ ] Traffic pattern analysis
- [ ] Machine learning for detection
- [ ] Multi-language support

---

<div align="center">

**[⬆ Back to top](#-traffic-violation-system)**

Made with ❤️ by the development team

</div>
