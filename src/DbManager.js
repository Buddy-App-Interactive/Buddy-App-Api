import mongoose from 'mongoose';

import user from './Schemas/user.js';
import chat from './Schemas/chat.js';
import chatrequest from './Schemas/chatrequest.js';
import message from './Schemas/message.js';

let db = undefined;
let User = undefined;
let Chat = undefined;
let ChatRequest = undefined;
let Message = undefined;

function initDb() {
  mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;
  User = mongoose.model('User', user);
  Chat = mongoose.model('Chat', chat);
  ChatRequest = mongoose.model('ChatRequest', chatrequest);
  Message = mongoose.model('Message', message);

  return db;
}

export {db, User, Chat, ChatRequest, Message, initDb};
