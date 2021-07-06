const {User, ChatRequest} = require('../Schemas/index.js');

class RequestController {
  fetchRequests = async (req, res) => {
    let result = await ChatRequest.find({});
    res.send(result);
  };

  fetchOwnRequests = async (req, res) => {
    let {currentUser} = req;
    let result = await ChatRequest.find({id_creator: currentUser._id});
    return res.send(result);
  };

  createRequest = async (req, res) => {
    let chatRequest = req.body;
    let result = await ChatRequest.create(chatRequest);
    return res.send(result);
  };
}

module.exports = new RequestController();
