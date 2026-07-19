import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}