import { Schema, model, Document, Types } from "mongoose";

export interface ISkill extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  availability: string;
  imageUrl?: string;
  tags: string[];
  embedding: number[];
  ownerId: Types.ObjectId;
  views: number;
  createdAt: Date;
}

const skillSchema = new Schema<ISkill>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { type: String, required: true, index: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  availability: { type: String, required: true },
  imageUrl: String,
  tags: { type: [String], default: [] },
  embedding: { type: [Number], required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

skillSchema.index({ title: "text", tags: "text" });

export const Skill = model<ISkill>("Skill", skillSchema);