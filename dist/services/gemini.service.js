"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSkillDescription = generateSkillDescription;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
    generationConfig: { responseMimeType: "application/json" },
});
const lengthGuide = {
    short: "2-3 sentences",
    medium: "1 short paragraph (4-6 sentences)",
    long: "2-3 short paragraphs",
};
async function generateSkillDescription(input) {
    const prompt = `You are helping a user on a peer-to-peer skill exchange platform write a compelling listing.

Title: ${input.title}
Category: ${input.category}
User's short description: ${input.shortDescription}

Write an expanded, engaging description (${lengthGuide[input.length]}) that:
- Explains what a learner will actually be able to do afterward (a concrete learning outcome)
- Includes one brief concrete example of what a session/lesson might cover
- Matches the tone of the category (practical for tech/business, warm for cooking/languages, etc.)
- Does NOT invent specific credentials, years of experience, or claims the user didn't state

Then suggest up to 5 short, relevant tags (single words or short phrases).

Respond ONLY as JSON: {"fullDescription": string, "tags": string[]}`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text() || "{}";
    const parsed = JSON.parse(raw);
    return {
        fullDescription: parsed.fullDescription || input.shortDescription,
        tags: (parsed.tags || []).slice(0, 5),
    };
}
