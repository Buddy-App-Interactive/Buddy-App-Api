const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const user = new Schema({
    id: { type: String },
    email: { type: String, default: null },
    password: { type: String, default: null },
    username: { type: String, default: null },
    loginKey: { type: String, default: null },
});
module.exports = user;