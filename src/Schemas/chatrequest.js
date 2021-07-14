const mongoose = require('mongoose');
const {Schema} = mongoose;

let requestType = {
  BORED: 10,
  DEPRESSED: 10,
  HAPPY: 10,
  JUSTTALK: 10,
};

const chatRequest = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  description: {type: String, default: null},
  type: {type: requestType, default: null},
  endDate: {type: Date, default: null},
  limit: {type: Number},
});

module.exports = mongoose.model('ChatRequest', chatRequest);
