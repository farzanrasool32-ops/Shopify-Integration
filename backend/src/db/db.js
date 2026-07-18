const mongoose = require("mongoose");
const dns = require("dns");

// Try to fix DNS resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}

module.exports = connectDB;
