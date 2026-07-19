import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  authId: string;       // BetterAuth's user id (from JWT `sub`), links this doc to the auth record
  name: string;
  email: string;
  bio?: string;
  interests: string[];
  profileEmbedding?: number[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  authId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: String,
  interests: { type: [String], default: [] },
  profileEmbedding: { type: [Number], default: undefined },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);