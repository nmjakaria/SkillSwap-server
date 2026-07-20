"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDescription = generateDescription;
const gemini_service_1 = require("../services/gemini.service");
async function generateDescription(req, res) {
    const result = await (0, gemini_service_1.generateSkillDescription)(req.body);
    res.json(result);
}
