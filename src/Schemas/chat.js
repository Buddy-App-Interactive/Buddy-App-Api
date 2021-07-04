import mongoose from "mongoose";
const { Schema } = mongoose;

const chat = new Schema({
  id: { type: String },
  id_chat_request: { type: String },
  id_from: { type: String },
  id_to: { type: String },
  created: { type: Date, default: null },
});

export default chat;
