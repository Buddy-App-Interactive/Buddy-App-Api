const {User} = require("../Schemas");
const {v4: uuidv4} = require('uuid');
var ObjectId = require('mongoose').Types.ObjectId;



class MoodController {
  updateMood = async (req, res) => {
    let {currentUser} = req;
    let userId = req.headers.user_id;
    let mood = req.headers.mood;

    let result = await User.updateOne({_id: ObjectId(userId)}, {mood: mood})
    return result
  }
}
module.exports = new MoodController();