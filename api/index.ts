// index.ts
import express from "express";
const app = express();

try {
    // existing setup: cors, connectDB middleware, routes...
} catch (err) {
    console.error("Startup error:", err);
    app.use((_req, res) => res.status(500).json({ error: "Startup failed", detail: String(err) }));
}

export default app;