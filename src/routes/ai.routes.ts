import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { generateDescriptionSchema } from "../schemas/skill.schema";
import { generateDescription } from "../controllers/ai.controller";

const router = Router();
router.post("/generate-description", requireAuth, validate(generateDescriptionSchema), generateDescription);

export default router;