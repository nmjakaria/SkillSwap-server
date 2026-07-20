// api/index.ts
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { env } from "../src/config/env";
import { errorHandler } from "../src/middleware/errorHandler";

import skillsRoutes from "../src/routes/skills.routes";
import aiRoutes from "../src/routes/ai.routes";
import usersRoutes from "../src/routes/users.routes";
import recommendationsRoutes from "../src/routes/recommendations.routes";

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());

let isConnected = false;
app.use(async (_req, _res, next) => {
  try {
    if (!isConnected) {
      await mongoose.connect(env.mongodbUri, { dbName: env.mongodbDbName });
      isConnected = true;
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/skills", skillsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.use(errorHandler);

export default app;