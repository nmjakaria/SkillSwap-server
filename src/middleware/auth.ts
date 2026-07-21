import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { User } from "../models/User";

// jose is ESM-only; can't be require()'d from compiled CommonJS output.
// Lazily import it, and cache both the module and the JWKS instance.
let josePromise: Promise<typeof import("jose")> | null = null;
function getJose() {
  if (!josePromise) josePromise = import("jose");
  return josePromise;
}

let jwksPromise: Promise<ReturnType<typeof import("jose").createRemoteJWKSet>> | null = null;
async function getJWKS() {
  if (!jwksPromise) {
    jwksPromise = getJose().then((jose) => jose.createRemoteJWKSet(new URL(env.jwksUrl)));
  }
  return jwksPromise;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing bearer token" });
    }
    const token = header.split(' ')[1];

    const { jwtVerify } = await getJose();
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