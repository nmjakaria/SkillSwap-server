"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const errorHandler_1 = require("./middleware/errorHandler");
const skills_routes_1 = __importDefault(require("./routes/skills.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const recommendations_routes_1 = __importDefault(require("./routes/recommendations.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: env_1.env.frontendUrl, credentials: true }));
app.use(express_1.default.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/skills", skills_routes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/recommendations", recommendations_routes_1.default);
app.get('/', (req, res) => {
    res.send('Server is running fine');
});
app.use(errorHandler_1.errorHandler);
(0, db_1.connectDB)().then(() => {
    app.listen(env_1.env.port, () => console.log(`API running on port ${env_1.env.port}`));
});
