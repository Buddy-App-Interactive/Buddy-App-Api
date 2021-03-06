const dotenv = require('dotenv');
dotenv.config();

const {
  RequestController,
  AuthController,
  ChatController,
  UserController,
} = require('./controllers/index.js');

const AuthService = require('./services/AuthService.js');

const attachCurrentUser = require('./middlewares/attachCurrentUser.js');
const isAuth = require('./middlewares/isAuth.js');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');

const {initDb} = require('./DbManager.js');

let app = express();

app.use(
  session({
    secret: 'asfawe5t43tgru547645',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const http = require('http').Server(app);

const db = initDb();

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Connected to DB!');
});

app.get('/', (req, res) => {
  res.send('welcome to the buddy app api');
});

app.get('/requests', isAuth, attachCurrentUser, RequestController.fetchRequests);
app.get('/requests/own', isAuth, attachCurrentUser, RequestController.fetchOwnRequests);
app.post('/requests', isAuth, attachCurrentUser, RequestController.createRequest);
app.put('/requests', isAuth, attachCurrentUser, RequestController.updateRequest);
app.post('/moods', isAuth, attachCurrentUser, UserController.updateMood);
app.post('/user', isAuth, attachCurrentUser, UserController.updateUser);
app.post('/password', isAuth, attachCurrentUser, UserController.updateUserPassword);
app.post('/login', AuthController.login);
app.post('/register', AuthController.register);
app.post('/chats', isAuth, attachCurrentUser, ChatController.createChat);
app.get('/chats', isAuth, attachCurrentUser, (req, res) => {
  return ChatController.fetchChats(req, res);
});
app.get('/messages', isAuth, attachCurrentUser, (req, res) => {
  return ChatController.fetchMessagesForChat(req, res);
});
app.get('/chats/karma', isAuth, attachCurrentUser, (req, res) => {
  return ChatController.fetchKarma(req, res);
});
app.post('/message/send', isAuth, attachCurrentUser, (req, res) => {
  return ChatController.sendMessage(req, res);
});

let io = require('socket.io')(http);

global.socketConnection = io;

io.sockets.on('connection', function (socket) {
  socket.on('storeClientInfo', function (data) {
    socket.join(JSON.parse(data).customId);
  });

  socket.on('disconnect', function (data) {});
});

const PORT = process.env.PORT || 5001;
http.listen(PORT, function () {
  console.log(`listening on ${PORT}`);
});
