import mongoose from "mongoose";
const { Schema } = mongoose;

const message = new Schema({
  id: { type: String },
  id_chat: { type: String },
  content: { type: Buffer, default: null },
  created: { type: Date, default: null },
});

export default message;
