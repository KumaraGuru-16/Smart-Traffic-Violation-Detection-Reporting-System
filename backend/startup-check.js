import dotenv from "dotenv";
import fs from "fs";
import path from "path";

console.log("\n🔍 TRAFFIC VIOLATION SYSTEM - STARTUP DIAGNOSTICS\n");
console.log("=".repeat(60));

// 1. Check .env file
console.log("\n1️⃣  CHECKING .ENV FILE");
const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  console.log("✅ .env file found");
  const result = dotenv.config();
  if (result.error) {
    console.error("❌ Error reading .env:", result.error.message);
  } else {
    console.log("✅ .env file loaded successfully");
  }
} else {
  console.error("❌ .env file NOT found at:", envPath);
  console.error("   Create .env file with:");
  console.error("   PORT=5000");
  console.error("   MONGO_URI=your_mongodb_uri");
  console.error("   JWT_SECRET=your_secret");
}

// 2. Check MongoDB connection
console.log("\n2️⃣  CHECKING MONGODB CONNECTION");
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not set in .env");
} else {
  console.log("✅ MONGO_URI found");
  // Mask the URI for security
  const maskedUri = process.env.MONGO_URI
    .replace(/:(.*?)@/, ":***@")
    .substring(0, 50) + "...";
  console.log("   URI:", maskedUri);

  // Try to connect
  import("mongoose").then((mongoose_module) => {
    const mongoose = mongoose_module.default;
    mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 5000,
      })
      .then(() => {
        console.log("✅ MongoDB connection successful!");
        mongoose.disconnect();
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        console.error("\n   Troubleshooting:");
        console.error("   • Check MongoDB Atlas cluster is running");
        console.error("   • Verify IP whitelist includes your machine");
        console.error("   • Check username/password in MONGO_URI");
        console.error("   • Try pinging: mongosh '<your_connection_string>'");
        process.exit(1);
      });
  });
}

// 3. Check required environment variables
console.log("\n3️⃣  CHECKING ENVIRONMENT VARIABLES");
const required = ["MONGO_URI", "JWT_SECRET"];
const optional = ["PORT", "CLOUD_NAME"];

required.forEach((env) => {
  if (process.env[env]) {
    console.log(`✅ ${env}: Set`);
  } else {
    console.error(`❌ ${env}: NOT SET (required)`);
  }
});

optional.forEach((env) => {
  if (process.env[env]) {
    console.log(`✅ ${env}: ${process.env[env]}`);
  } else {
    console.log(`⚠️  ${env}: Not set (optional)`);
  }
});

console.log("\n4️⃣  CHECKING NODE/NPM");
console.log("✅ Node version:", process.version);
console.log("=".repeat(60) + "\n");
