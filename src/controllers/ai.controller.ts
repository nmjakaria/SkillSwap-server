import { Request, Response } from "express";
import { generateSkillDescription } from "../services/gemini.service";

export async function generateDescription(req: Request, res: Response) {
  const result = await generateSkillDescription(req.body);
  res.json(result);
}