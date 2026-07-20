"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const mongoose_1 = require("mongoose");
const skillSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: { type: String, required: true, index: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    availability: { type: String, required: true },
    imageUrl: String,
    tags: { type: [String], default: [] },
    embedding: { type: [Number], required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
skillSchema.index({ title: "text", tags: "text" });
exports.Skill = (0, mongoose_1.model)("Skill", skillSchema);
