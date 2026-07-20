"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDescriptionSchema = exports.createSkillSchema = void 0;
const zod_1 = require("zod");
exports.createSkillSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(100),
    shortDescription: zod_1.z.string().min(10).max(300),
    fullDescription: zod_1.z.string().min(20),
    category: zod_1.z.string().min(1),
    level: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]),
    availability: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().optional(),
    tags: zod_1.z.array(zod_1.z.string()).max(5).optional(),
});
exports.generateDescriptionSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    shortDescription: zod_1.z.string().min(10),
    category: zod_1.z.string().min(1),
    length: zod_1.z.enum(["short", "medium", "long"]).default("medium"),
});
