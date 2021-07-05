const mongoose = require('mongoose');
const {Schema} = mongoose;

const message = new Schema({
  chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
  sender: {type: Schema.Types.ObjectId, ref: 'User'},
  content: Buffer,
  created: {type: Date, default: null},
});

module.exports = mongoose.model('Message', message);
