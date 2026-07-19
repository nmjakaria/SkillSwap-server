import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  skillId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  skillId: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", messageSchema);