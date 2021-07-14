const { User } = require('../Schemas/index.js');
const AuthService = require('../services/AuthService.js');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserController {
  updateUser = async (req, res) => {
    let {currentUser} = req;
    let data = {}
    data.username = req.headers.username
    if(req.headers.email){
      data.email = req.headers.email
    }
    let result = await User.updateOne({_id: currentUser._id}, data)
    return result
  }

  updateUserPassword = async (req, res) => {
    let {currentUser} = req;
    let result = await User.updateOne({_id: currentUser._id}, {password: bcrypt.hashSync(req.headers.password, saltRounds)})
    return result
  }

  updateMood = async (req, res) => {
    let {currentUser} = req;
    let userId = req.headers.user_id;
    let mood = req.headers.mood;

    let result = await User.updateOne({_id: ObjectId(userId)}, {mood: mood})
    return result
  }
}

module.exports = new UserController();
