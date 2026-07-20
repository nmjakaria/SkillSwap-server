"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function required(key) {
    const value = process.env[key];
    if (!value)
        throw new Error(`Missing required env var: ${key}`);
    return value;
}
const frontendUrl = required("FRONTEND_URL");
exports.env = {
    port: process.env.PORT || 4000,
    mongodbUri: required("MONGODB_URI"),
    mongodbDbName: required("MONGODB_DB_NAME"),
    geminiApiKey: required("GEMINI_API_KEY"),
    frontendUrl,
    jwksUrl: `${frontendUrl}/api/auth/jwks`,
    jwtIssuer: frontendUrl,
};
