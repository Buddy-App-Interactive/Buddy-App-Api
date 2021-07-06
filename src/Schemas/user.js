const mongoose = require('mongoose');
const {Schema} = mongoose;

let mood = {
  HAPPY: 1,
  SAD: 2,
  OK: 3,
};

const user = new Schema({
  email: {type: String, default: null},
  password: {type: String, default: null},
  username: {type: String, default: null},
  loginKey: {type: String, default: null},
  mood: {type: mood, default: 1}
});

module.exports = mongoose.model('User', user);
