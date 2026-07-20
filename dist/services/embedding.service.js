"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbedding = createEmbedding;
exports.cosineSimilarity = cosineSimilarity;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("../config/env");
const genAI = new generative_ai_1.GoogleGenerativeAI(env_1.env.geminiApiKey);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
async function createEmbedding(text) {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}
function cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] ** 2;
        normB += b[i] ** 2;
    }
    if (normA === 0 || normB === 0)
        return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
