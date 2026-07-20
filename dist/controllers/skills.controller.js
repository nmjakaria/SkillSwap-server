"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSkills = listSkills;
exports.getSkill = getSkill;
exports.createSkill = createSkill;
exports.deleteSkill = deleteSkill;
exports.mySkills = mySkills;
exports.relatedSkills = relatedSkills;
const Skill_1 = require("../models/Skill");
const embedding_service_1 = require("../services/embedding.service");
async function listSkills(req, res) {
    const { search, category, sort = "newest", page = "1" } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;
    const filter = {};
    if (category)
        filter.category = category;
    if (search)
        filter.$text = { $search: String(search) };
    const sortMap = {
        newest: { createdAt: -1 },
        popular: { views: -1 },
    };
    const [items, total] = await Promise.all([
        Skill_1.Skill.find(filter).sort(sortMap[String(sort)] || sortMap.newest).skip(skip).limit(limit),
        Skill_1.Skill.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), totalPages: Math.ceil(total / limit) });
}
async function getSkill(req, res) {
    const skill = await Skill_1.Skill.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { returnDocument: "after" });
    if (!skill)
        return res.status(404).json({ error: "Skill not found" });
    res.json(skill);
}
async function createSkill(req, res) {
    const embedding = await (0, embedding_service_1.createEmbedding)(`${req.body.title}. ${req.body.fullDescription}`);
    const skill = await Skill_1.Skill.create({ ...req.body, ownerId: req.userId, embedding });
    res.status(201).json(skill);
}
async function deleteSkill(req, res) {
    const skill = await Skill_1.Skill.findById(req.params.id);
    if (!skill)
        return res.status(404).json({ error: "Skill not found" });
    if (skill.ownerId.toString() !== req.userId) {
        return res.status(403).json({ error: "Not your skill" });
    }
    await skill.deleteOne();
    res.status(204).send();
}
async function mySkills(req, res) {
    const skills = await Skill_1.Skill.find({ ownerId: req.userId }).sort({ createdAt: -1 });
    res.json(skills);
}
async function relatedSkills(req, res) {
    const skill = await Skill_1.Skill.findById(req.params.id);
    if (!skill)
        return res.status(404).json({ error: "Skill not found" });
    const others = await Skill_1.Skill.find({ _id: { $ne: skill._id } });
    const ranked = others
        .map((s) => ({ skill: s, score: (0, embedding_service_1.cosineSimilarity)(skill.embedding, s.embedding) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((r) => r.skill);
    res.json(ranked);
}
