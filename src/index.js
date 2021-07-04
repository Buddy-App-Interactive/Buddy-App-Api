import dotenv from 'dotenv';
dotenv.config();

import {RequestControler, AuthController} from './controllers/index.js';

import AuthService from './services/AuthService.js';

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import {v4 as uuidv4} from 'uuid';

import user from './Schemas/user.js';
import chat from './Schemas/chat.js';
import chatrequest from './Schemas/chatrequest.js';
import message from './Schemas/message.js';

import {initDb} from './DbManager.js';

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

import {Server} from 'socket.io';
//const io = new Server(app);

const db = initDb();

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Connected to DB!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));

app.get('/', (req, res) => {
  res.send('welcome to the buddy app api');
});

app.get('/requests', RequestControler.fetchRequests);
app.post('/login', AuthController.login);
app.post('/register', AuthController.register);
