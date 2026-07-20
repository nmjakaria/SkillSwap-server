"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    skillId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Skill", required: true },
    fromUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
