import { Schema, model, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  text: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Message = model<IMessage>("Message", messageSchema);
