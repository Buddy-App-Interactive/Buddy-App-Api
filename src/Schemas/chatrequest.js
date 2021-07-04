import mongoose from "mongoose";
const { Schema } = mongoose;

let requestType = {
  BORED,
  DEPRESSED,
  HAPPY,
  JUSTTALK,
};

const chatRequest = new Schema({
  id: { type: String },
  id_creator: { type: String },
  description: { type: String, default: null },
  type: { type: requestType, default: null },
  timeframe: { type: Date, default: null },
  limit: { type: Number },
});

export default chatRequest;
