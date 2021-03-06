const {v4: uuidv4} = require('uuid');

const { User } = require('../Schemas/index.js');
const AuthService = require('../services/AuthService.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class AuthController {
  fetchRequests = function (req, res) {};

  createRequest = function (req, res) {};

  register(request, response) {
    var email = request.body.email;
    if(password)
      var password = bcrypt.hashSync(request.body.password, saltRounds);
    var username = request.body.username;

    if (email && password && username) {
      User.create(
        {password: password, username: username, email: email},
        function (err, user) {
          if (err) response.sendStatus(500);
          else response.send({
            id: user._id,
            email: user.email,
            username: user.username,
            jwt: AuthService.generateToken(user),
            mood: user.mood
          });
        }
      );
    } else if (username) {
      User.create({username: username, loginKey: uuidv4()}, function (err, user) {
        if (err) response.sendStatus(500);
        else response.send({
          id: user._id,
          loginKey: user.loginKey,
          username: user.username,
          jwt: AuthService.generateToken(user),
          mood: user.mood
        });
      });
    } else {
      response.sendStatus(400);
      response.end();
    }
  }

  login(request, response) {
    var email = request.body.email;
    var loginKey = request.body.loginKey;
    var password = request.body.password

    if (email && password) {
      User.findOne({email: email}, function (err, user) {
        if(user && !bcrypt.compareSync(request.body.password, user.password))
          response.sendStatus(404)
        else if (user) {
          request.session.loggedin = true;
          request.session.email = email;
          request.session.username = user.username;
          request.session.user_id = user.id;
          response.send({
            id: user._id,
            email: user.email,
            username: user.username,
            jwt: AuthService.generateToken(user),
            mood: user.mood
          });
        } else {
          response.sendStatus(404);
        }
        response.end();
      });
    } else if (loginKey) {
      User.findOne({loginKey: loginKey}, function (err, user) {
        if (user) {
          request.session.loggedin = true;
          request.session.email = '';
          request.session.username = user.username;
          request.session.user_id = user.id;
          response.send({
            id: user._id,
            loginKey: user.loginKey,
            username: user.username,
            jwt: AuthService.generateToken(user),
            mood: user.mood
          });
        } else {
          response.sendStatus(404);
        }
        response.end();
      });
    } else {
      response.sendStatus(401);
      response.end();
    }
  }
}

module.exports = new AuthController();
