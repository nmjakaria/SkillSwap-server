import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { errorHandler } from "./middleware/errorHandler";

import skillsRoutes from "./routes/skills.routes";
import aiRoutes from "./routes/ai.routes";
import usersRoutes from "./routes/users.routes";
import recommendationsRoutes from "./routes/recommendations.routes";

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());


app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/skills", skillsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/recommendations", recommendationsRoutes);

app.get('/', (req, res) => {
    res.send('Server is running fine');
});

app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.port, () => console.log(`API running on port ${env.port}`));
});