const {User, ChatRequest} = require('../Schemas/index.js');

class RequestController {
  fetchRequests = async (req, res) => {
    let {currentUser} = req;
    let result = await ChatRequest.find({creator: {$ne: currentUser._id}}).populate([
      {path: 'creator', select: 'username _id'},
    ]);
    res.send(result);
  };

  fetchOwnRequests = async (req, res) => {
    let {currentUser} = req;
    let result = await ChatRequest.find({creator: currentUser._id}).populate([
      {path: 'creator', select: 'username _id'},
    ]);
    return res.send(result);
  };

  createRequest = async (req, res) => {
    let chatRequest = JSON.parse(req.body.request);
    let result = await ChatRequest.create(chatRequest);
    result = await ChatRequest.findOne({_id: result._id}).populate([
      {path: 'creator', select: 'username _id'},
    ]);
    return res.send(result);
  };

  updateRequest = async (req, res) => {
    let chatRequest = JSON.parse(req.body.request);
    await ChatRequest.updateOne({_id: chatRequest._id}, chatRequest);
    let result = await ChatRequest.findOne({_id: chatRequest._id}).populate([
      {path: 'creator', select: 'username _id'},
    ]);
    return res.send(result);
  };
}

module.exports = new RequestController();
