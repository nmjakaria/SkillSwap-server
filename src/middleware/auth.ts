import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { User } from "../models/User";
import { createRemoteJWKSet, jwtVerify } from "jose-cjs";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
    if (!jwks) {
        const authUrl = env.frontendUrl;
        if (!authUrl) {
            throw new Error('BETTER_AUTH_URL is not defined in .env');
        }
        jwks = createRemoteJWKSet(new URL(`${env.frontendUrl}/api/auth/jwks`));
    }
    return jwks;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  //  console.log("Authorization header received:", req.headers.authorization)
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing bearer token" });
    }
    const token = header.split(' ')[1];

    const JWKS = await getJWKS();

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.jwtIssuer,
    });

    const authId = payload.sub;
    if (!authId) return res.status(401).json({ error: "Invalid token payload" });

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