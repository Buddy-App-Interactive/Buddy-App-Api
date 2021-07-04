import dotenv from "dotenv";
dotenv.config();

import { RequestControler } from "./controllers/index.js";

import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

import user from "./Schemas/user.js";
import chat from "./Schemas/chat.js";
import chatrequest from "./Schemas/chatrequest.js";
import message from "./Schemas/message.js";

let app = express();

app.use(
  session({
    secret: "asfawe5t43tgru547645",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import { Server } from "socket.io";
//const io = new Server(app);

import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
const User = mongoose.model("User", user);

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function () {
  console.log("Connected to DB!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));

app.get("/", (req, res) => {
  res.send("welcome to the buddy app api");
});

/*
io.on("connection", (socket) => {
  console.log("request received");
});
*/

app.post("/login", (request, response) => {
  var email = request.body.email;
  var password = request.body.password;
  var loginKey = request.body.loginKey;
  if (email && password) {
    User.findOne({ email: email, password: password }, function (err, user) {
      if (user) {
        request.session.loggedin = true;
        request.session.email = email;
        request.session.username = user.username;
        request.session.id = user.id;
        response.send(user);
      } else {
        response.sendStatus(404);
      }
      response.end();
    });
  } else if (loginKey) {
    User.findOne({ loginKey: loginKey }, function (err, user) {
      if (user) {
        request.session.loggedin = true;
        request.session.email = "";
        request.session.username = user.username;
        request.session.id = user.id;
        response.send(user);
      } else {
        response.sendStatus(404);
      }
      response.end();
    });
  } else {
    response.sendStatus(401);
    response.end();
  }
});

app.post("/register", (request, response) => {
  var email = request.body.email;
  var password = request.body.password;
  var username = request.body.username;
  var loginKey = request.body.loginKey;
  if (email && password && username) {
    User.create(
      { id: uuidv4(), password: password, username: username, email: email },
      function (err, user) {
        if (err) response.sendStatus(500);
        else response.send(user);
      }
    );
  } else if (loginKey && username) {
    User.create(
      { id: uuidv4(), username: username, loginKey: loginKey },
      function (err, user) {
        if (err) response.sendStatus(500);
        else response.send(user);
      }
    );
  } else {
    response.sendStatus(400);
    response.end();
  }
});

app.get("/requests", new RequestControler().fetchRequests);
