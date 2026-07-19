import { Request, Response } from "express";
import { Skill } from "../models/Skill";
import { User } from "../models/User";
import { cosineSimilarity } from "../services/embedding.service";

export async function getRecommendations(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user?.profileEmbedding) {
    return res.json({ items: [], note: "Add interests to your profile to get recommendations." });
  }

  const skills = await Skill.find({ ownerId: { $ne: req.userId } });
  const ranked = skills
    .map((s) => ({ skill: s, score: cosineSimilarity(user.profileEmbedding!, s.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.skill);

  res.json({ items: ranked });
}