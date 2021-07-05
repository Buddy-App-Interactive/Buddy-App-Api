const dotenv = require('dotenv');
dotenv.config();



const {RequestController, AuthController, ChatController} = require('./controllers/index.js');

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

app.get('/requests', RequestController.fetchRequests);
app.get('/requests/own', RequestController.fetchOwnRequests);
app.post('/login', AuthController.login);
app.post('/register', AuthController.register);
app.get('/chats', isAuth, attachCurrentUser, (req, res) => {
    return ChatController.fetchChats(req,res)
})
app.get('/messages', isAuth, attachCurrentUser, (req, res) => {
    return ChatController.fetchMessagesForChat(req,res)
})

global.socketClients =[];
global.socketConnection = undefined;
app.post('/message/send', isAuth, attachCurrentUser, (req, res) => {
    return ChatController.sendMessage(req,res)
})


let io = require('socket.io')(http);


io.sockets.on('connection', function (socket) {
    socketConnection = socket;

    socket.on('storeClientInfo', function (data) {
        var clientInfo = {};
        clientInfo.customId = JSON.parse(data).customId;
        clientInfo.clientId = socket.id;
        socketClients.push(clientInfo);
    });

    socket.on('disconnect', function (data) {
        for( var i=0, len=socketClients.length; i<len; ++i ){
            var c = socketClients[i];
            if(c.clientId === socket.id){
                socketClients.splice(i,1);
                break;
            }
        }
    });


});


const PORT = process.env.PORT || 5001;
http.listen(PORT, function() {
    console.log(`listening on ${PORT}`);
});