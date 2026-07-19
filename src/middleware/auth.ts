import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env";
import { User } from "../models/User";

const JWKS = createRemoteJWKSet(new URL(env.jwksUrl));

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing bearer token" });
    }
    const token = header.slice("Bearer ".length);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.jwtIssuer,
    });

    const authId = payload.sub;
    if (!authId) return res.status(401).json({ error: "Invalid token payload" });

    // Find or lazily create the corresponding app-side User doc.
    // (BetterAuth owns identity; this User doc holds app-specific fields like bio/interests/embedding.)
    let user = await User.findOne({ authId });
    if (!user) {
      user = await User.create({
        authId,
        name: (payload.name as string) || "New User",
        email: (payload.email as string) || `${authId}@placeholder.local`,
      });
    }

    req.userId = user._id.toString();
    req.authId = authId as string;
    next();
  } catch (err) {
    console.error("Auth verification failed:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}