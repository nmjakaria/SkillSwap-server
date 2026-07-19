import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;   // MongoDB _id of the User doc, set by auth middleware
      authId?: string;   // raw BetterAuth subject id from the JWT
    }
  }
}