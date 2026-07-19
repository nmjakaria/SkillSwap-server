import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getRecommendations } from "../controllers/recommendations.controller";

const router = Router();
router.get("/", requireAuth, getRecommendations);
export default router;