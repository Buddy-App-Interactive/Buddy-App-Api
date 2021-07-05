const mongoose = require('mongoose');
const {Schema} = mongoose;

let requestType = {
  BORED: 10,
  DEPRESSED: 10,
  HAPPY: 10,
  JUSTTALK: 10,
};

const chatRequest = new Schema({
  id_creator: {type: String},
  description: {type: String, default: null},
  type: {type: requestType, default: null},
  timeframe: {type: Date, default: null},
  limit: {type: Number},
});

module.exports = mongoose.model('ChatRequest', chatRequest);
