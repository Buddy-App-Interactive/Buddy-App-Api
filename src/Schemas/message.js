const mongoose = require('mongoose');
const {Schema} = mongoose;

const message = new Schema({
  id: {type: String},
  id_chat: {type: String},
  content: {type: Buffer, default: null},
  created: {type: Date, default: null},
});

module.exports = message;
