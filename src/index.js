const dotenv = require('dotenv');
dotenv.config();

const {RequestControler, AuthController} = require('./controllers/index.js');

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

//import {Server} from 'socket.io';
//const io = new Server(app);

const db = initDb();

console.log(attachCurrentUser);

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
