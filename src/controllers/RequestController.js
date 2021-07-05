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

  createRequest = function (req, res) {
    // TODO: implement
  };
}

module.exports = new RequestController();
