const mongoose = require('mongoose');
const {Schema} = mongoose;

const chat = new Schema({
  id: {type: String},
  id_chat_request: {type: String},
  id_from: {type: String},
  id_to: {type: String},
  created: {type: Date, default: null},
});

module.exports = chat;
