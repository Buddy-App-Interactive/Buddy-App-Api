require('dotenv').config()

const { v4: uuidv4 } = require('uuid');
let express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
let app = express()
app.use(session({
    secret: 'asfawe5t43tgru547645',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
const io = require('socket.io')(80);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
const User = mongoose.model('User',require("./Schemas/user"))

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("Connected to DB!")
});

const PORT  = process.env.PORT || 5001
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`))

app.get("/", (req, res) => {
    res.send("welcome to the buddy app api");
})

io.on('connection', (socket) => {
    console.log('request received');
});

app.post("/login", (request, response) => {
    var email = request.body.email;
    var password = request.body.password;
    var loginKey = request.body.loginKey;
    if (email && password) {
        User.findOne({'email':email, 'password':password},function (err, user){
            if(user){
                request.session.loggedin = true;
                request.session.email = email;
                request.session.username = user.username;
                request.session.id = user.id;
                response.send(user)
            }
            else{
                response.sendStatus(404);
            }
            response.end();
        })
    }
    else if (loginKey) {
        User.findOne({'loginKey':loginKey},function (err, user){
            if(user){
                request.session.loggedin = true;
                request.session.email = "";
                request.session.username = user.username;
                request.session.id = user.id;
                response.send(user)
            }
            else{
                response.sendStatus(404);
            }
            response.end();
        })
    }
    else {
        response.sendStatus(401);
        response.end();
    }
})

app.put("/register", (request, response) => {
    var email = request.body.email;
    var password = request.body.password;
    var username = request.body.username;
    var loginKey = request.body.loginKey;
    if (email && password && username) {
        User.create({id:uuidv4(), password: password, username: username, email: email }, function (err, user){
           if(err) response.sendStatus(500);
           else response.sendStatus(200);
        });
    }
    if(loginKey && username){
        User.create({id:uuidv4(), username: username, loginKey: loginKey }, function (err, user){
            if(err) response.sendStatus(500);
            else response.sendStatus(200);
        });
    }
    else {
        response.sendStatus(400);
        response.end();
    }
})