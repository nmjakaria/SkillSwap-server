import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  // Check if mongoose is already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(env.mongodbUri, { 
      dbName: env.mongodbDbName,
      serverSelectionTimeoutMS: 5000 // Fail fast if DB is unreachable (e.g. whitelist issue)
    });
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err; // Throw instead of killing process with exit(1) in serverless environments
  }
}