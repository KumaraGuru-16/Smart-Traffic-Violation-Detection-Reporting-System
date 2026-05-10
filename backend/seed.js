import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const seedDB = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Clear existing users
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    // 3. Create demo users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const demoUsers = [
      {
        name: "Demo User",
        email: "user@example.com",
        password: hashedPassword,
        role: "user"
      },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin"
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log(`✅ Created ${createdUsers.length} demo users`);

    createdUsers.forEach(user => {
      console.log(`  📧 ${user.email} (${user.role})`);
    });

    // 4. Disconnect
    await mongoose.disconnect();
    console.log("✅ Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();
