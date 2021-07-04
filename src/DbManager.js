const mongoose = require('mongoose');

let db = undefined;

function initDb() {
  mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;

  return db;
}

module.exports = {db, initDb};
