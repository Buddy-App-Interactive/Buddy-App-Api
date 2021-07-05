const mongoose = require('mongoose');
const {Schema} = mongoose;

const user = new Schema({
  email: {type: String, default: null},
  password: {type: String, default: null},
  username: {type: String, default: null},
  loginKey: {type: String, default: null},
});

module.exports = mongoose.model('User', user);
