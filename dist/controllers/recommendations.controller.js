"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = getRecommendations;
const Skill_1 = require("../models/Skill");
const User_1 = require("../models/User");
const embedding_service_1 = require("../services/embedding.service");
async function getRecommendations(req, res) {
    const user = await User_1.User.findById(req.userId);
    if (!user?.profileEmbedding) {
        return res.json({ items: [], note: "Add interests to your profile to get recommendations." });
    }
    const skills = await Skill_1.Skill.find({ ownerId: { $ne: req.userId } });
    const ranked = skills
        .map((s) => ({ skill: s, score: (0, embedding_service_1.cosineSimilarity)(user.profileEmbedding, s.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((r) => r.skill);
    res.json({ items: ranked });
}
