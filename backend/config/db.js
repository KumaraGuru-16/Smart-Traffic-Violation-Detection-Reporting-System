import mongoose from "mongoose";

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`❌ MongoDB Connection Attempt ${i + 1}/${retries} Failed:`, error.message);

      if (i < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000); // exponential backoff
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.warn("⚠️  MongoDB connection failed after all retries. Server running in limited mode.");
        // Don't exit - allow server to start so frontend knows backend is running
        return null;
      }
    }
  }
};

export default connectDB;