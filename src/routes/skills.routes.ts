import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createSkillSchema } from "../schemas/skill.schema";
import {
  listSkills, getSkill, createSkill, deleteSkill, mySkills, relatedSkills,
} from "../controllers/skills.controller";

const router = Router();

router.get("/", listSkills);
router.get("/mine", requireAuth, mySkills);
router.get("/:id", getSkill);
router.get("/:id/related", relatedSkills);
router.post("/", requireAuth, validate(createSkillSchema), createSkill);
router.delete("/:id", requireAuth, deleteSkill);

export default router;