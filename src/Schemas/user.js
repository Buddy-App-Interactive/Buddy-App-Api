import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
  id: { type: String },
  email: { type: String, default: null },
  password: { type: String, default: null },
  username: { type: String, default: null },
  loginKey: { type: String, default: null },
});

export default user;
