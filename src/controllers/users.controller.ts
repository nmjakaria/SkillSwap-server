import { Request, Response } from "express";
import { User } from "../models/User";
import { createEmbedding } from "../services/embedding.service";

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  res.json(user);
}

export async function updateMe(req: Request, res: Response) {
  const { bio, interests } = req.body as { bio?: string; interests?: string[] };
  const update: Record<string, unknown> = {};
  if (bio !== undefined) update.bio = bio;
  if (interests !== undefined) update.interests = interests;

  if (bio || interests?.length) {
    const text = [bio, ...(interests || [])].filter(Boolean).join(". ");
    update.profileEmbedding = await createEmbedding(text);
  }

  const user = await User.findByIdAndUpdate(req.userId, update, { returnDocument: "after" });
  res.json(user);
}