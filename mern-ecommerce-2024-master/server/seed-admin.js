const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const User = require("./models/User");

    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("Admin already exists! Email: admin@example.com");
      await mongoose.disconnect();
      return;
    }

    const hashPassword = await bcrypt.hash("admin123", 12);
    const admin = new User({
      userName: "admin",
      email: "admin@example.com",
      password: hashPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin account created!");
    console.log("  Email:    admin@example.com");
    console.log("  Password: admin123");

    await mongoose.disconnect();
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

seedAdmin();
