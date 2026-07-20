"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jose_1 = require("jose");
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const JWKS = (0, jose_1.createRemoteJWKSet)(new URL(env_1.env.jwksUrl));
async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing bearer token" });
        }
        const token = header.slice("Bearer ".length);
        const { payload } = await (0, jose_1.jwtVerify)(token, JWKS, {
            issuer: env_1.env.jwtIssuer,
        });
        const authId = payload.sub;
        if (!authId)
            return res.status(401).json({ error: "Invalid token payload" });
        // Find or lazily create the corresponding app-side User doc.
        // (BetterAuth owns identity; this User doc holds app-specific fields like bio/interests/embedding.)
        let user = await User_1.User.findOne({ authId });
        if (!user) {
            user = await User_1.User.create({
                authId,
                name: payload.name || "New User",
                email: payload.email || `${authId}@placeholder.local`,
            });
        }
        req.userId = user._id.toString();
        req.authId = authId;
        next();
    }
    catch (err) {
        console.error("Auth verification failed:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
