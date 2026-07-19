import { z } from "zod";

export const createSkillSchema = z.object({
  title: z.string().min(3).max(100),
  shortDescription: z.string().min(10).max(300),
  fullDescription: z.string().min(20),
  category: z.string().min(1),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  availability: z.string().min(1),
  imageUrl: z.string().url().optional(),
  tags: z.array(z.string()).max(5).optional(),
});

export const generateDescriptionSchema = z.object({
  title: z.string().min(3),
  shortDescription: z.string().min(10),
  category: z.string().min(1),
  length: z.enum(["short", "medium", "long"]).default("medium"),
});