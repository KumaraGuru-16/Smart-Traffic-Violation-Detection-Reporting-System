import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

// middleware
app.use(express.json());
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// static folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health check endpoints (ALWAYS available)
app.get("/", (req, res) => {
  res.json({ status: "✅ API running", timestamp: new Date() });
});

app.get("/health", (req, res) => {
  res.json({
    status: "✅ Backend is running",
    db: global.dbConnected ? "✅ Connected" : "⚠️  Retrying...",
    timestamp: new Date(),
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  global.dbConnected = false;

  // Try to connect to DB
  const dbResult = await connectDB();
  if (dbResult) {
    global.dbConnected = true;
  }

  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📤 Cloudinary configured: ${process.env.CLOUD_NAME}`);
    console.log(`📍 Visit http://localhost:${PORT}/health to check status`);
  });

  // Handle server errors
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error("   Try running: lsof -ti:${PORT} | xargs kill -9");
    } else {
      console.error("❌ Server Error:", error);
    }
    process.exit(1);
  });

  // Graceful shutdown
  return server;
};

startServer();