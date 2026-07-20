import { Request, Response } from "express";
import { Skill } from "../models/Skill";
import { createEmbedding, cosineSimilarity } from "../services/embedding.service";

export async function listSkills(req: Request, res: Response) {
  const { search, category, sort = "newest", page = "1" } = req.query;
  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (search) filter.$text = { $search: String(search) };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    popular: { views: -1 },
  };

  const [items, total] = await Promise.all([
    Skill.find(filter).sort(sortMap[String(sort)] || sortMap.newest).skip(skip).limit(limit),
    Skill.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), totalPages: Math.ceil(total / limit) });
}

export async function getSkill(req: Request, res: Response) {
  const skill = await Skill.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { returnDocument: "after" });
  if (!skill) return res.status(404).json({ error: "Skill not found" });
  res.json(skill);
}

export async function createSkill(req: Request, res: Response) {
  const embedding = await createEmbedding(`${req.body.title}. ${req.body.fullDescription}`);
  const skill = await Skill.create({ ...req.body, ownerId: req.userId, embedding });
  res.status(201).json(skill);
}

export async function deleteSkill(req: Request, res: Response) {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).json({ error: "Skill not found" });
  if (skill.ownerId.toString() !== req.userId) {
    return res.status(403).json({ error: "Not your skill" });
  }
  await skill.deleteOne();
  res.status(204).send();
}

export async function mySkills(req: Request, res: Response) {
  const skills = await Skill.find({ ownerId: req.userId }).sort({ createdAt: -1 });
  res.json(skills);
}

export async function relatedSkills(req: Request, res: Response) {
  const skill = await Skill.findById(req.params.id);
  if (!skill) return res.status(404).json({ error: "Skill not found" });

  const others = await Skill.find({ _id: { $ne: skill._id } });
  const ranked = others
    .map((s) => ({ skill: s, score: cosineSimilarity(skill.embedding, s.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.skill);

  res.json(ranked);
}