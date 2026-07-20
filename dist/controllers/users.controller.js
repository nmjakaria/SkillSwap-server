"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.updateMe = updateMe;
const User_1 = require("../models/User");
const embedding_service_1 = require("../services/embedding.service");
async function getMe(req, res) {
    const user = await User_1.User.findById(req.userId);
    res.json(user);
}
async function updateMe(req, res) {
    const { bio, interests } = req.body;
    const update = {};
    if (bio !== undefined)
        update.bio = bio;
    if (interests !== undefined)
        update.interests = interests;
    if (bio || interests?.length) {
        const text = [bio, ...(interests || [])].filter(Boolean).join(". ");
        update.profileEmbedding = await (0, embedding_service_1.createEmbedding)(text);
    }
    const user = await User_1.User.findByIdAndUpdate(req.userId, update, { returnDocument: "after" });
    res.json(user);
}
