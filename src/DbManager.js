const mongoose = require('mongoose');

const user = require('./Schemas/user.js');
const chat = require('./Schemas/chat.js');
const chatrequest = require('./Schemas/chatrequest.js');
const message = require('./Schemas/message.js');

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

module.exports = {db, User, Chat, ChatRequest, Message, initDb};
