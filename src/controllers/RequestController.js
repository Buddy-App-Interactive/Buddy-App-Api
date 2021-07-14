const {User, ChatRequest} = require('../Schemas/index.js');

class RequestController {
  fetchRequests = async (req, res) => {
    let result = await ChatRequest.find({})
        .populate([{path:'creator', select:'username _id'}]);
    res.send(result);
  };

  fetchOwnRequests = async (req, res) => {
    let {currentUser} = req;
    let result = await ChatRequest.find({creator: currentUser._id})
        .populate([{path:'creator', select:'username _id'}]);
    return res.send(result);
  };

  createRequest = async (req, res) => {
    let chatRequest = JSON.parse(req.body.request);
    let result = await ChatRequest.create(chatRequest);
    result = await ChatRequest.findOne({_id:result._id})
        .populate([{path:'creator', select:'username _id'}]);
    return res.send(result);
  };
}

module.exports = new RequestController();
