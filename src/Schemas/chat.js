const mongoose = require('mongoose');
const {Schema} = mongoose;

const chat = new Schema({
  chat_request: { type: Schema.Types.ObjectId, ref: 'Request' },
  user_from: { type: Schema.Types.ObjectId, ref: 'User' },
  user_to: { type: Schema.Types.ObjectId, ref: 'User'},
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

module.exports = mongoose.model('Chat', chat);
