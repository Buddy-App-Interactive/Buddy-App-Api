const {Chat, Message} = require('../Schemas/index.js');
var ObjectId = require('mongoose').Types.ObjectId;
var dateFormat = require('dateformat');

class ChatController {
  fetchChats = async (req, res) => {
    let {currentUser} = req;
    let result = await Chat.find({$or: [{user_from: currentUser._id}, {user_to: currentUser._id}]})
      .populate('user_from', '_id username mood')
      .populate('user_to', '_id username mood');

    let map = await Promise.all(
      result.map(async item => {
        const container = {};

        let message = await Message.findOne({chat: item._id})
          .sort('-created')
          .populate([{path: 'sender', select: 'username _id'}]);
        let container_mesage = {};

        container_mesage._id = message ? message._id : ObjectId();
        container_mesage.username = message ? message.sender.username : '';
        container_mesage.content = message
          ? message.content.toString()
          : Buffer.from('No message sent yet..', 'utf-8').toString();
        container_mesage.chatId = message ? message.chat : item._id;
        container_mesage.senderId = message ? message.sender._id : ObjectId();
        container_mesage.created = message
          ? dateFormat(message.created, 'dd/mm/yyyy HH:MM')
          : dateFormat(Date.now(), 'dd/mm/yyyy HH:MM');

        container._id = item._id;
        container.username =
          item.user_to._id.toString() === currentUser._id.toString()
            ? item.user_from.username
            : item.user_to.username;
        container.mood =
          item.user_to._id.toString() === currentUser._id.toString()
            ? item.user_from.mood
            : item.user_to.mood;
        container.lastMessage = container_mesage;
        container.requestId = item.chat_request;

        return container;
      })
    );
    res.send(map);
  };

  createChat = async (req, res) => {
    let {currentUser} = req;
    let requestId = req.headers.requestid;
    console.log(req.headers.creatorid);
    let requestCreatorId = ObjectId(req.headers.creatorid);

    let result = await Chat.create({
      chat_request: requestId,
      user_from: currentUser._id,
      user_to: requestCreatorId.toString(),
    });
    result = await Chat.findOne({
      _id: result._id,
    })
      .populate('user_from', 'username mood')
      .populate('user_to', 'username mood');
    let container = {};
    container._id = result._id;
    container.username =
      result.user_to.toString() === currentUser._id.toString()
        ? result.user_from.username
        : result.user_to.username;
    container.mood =
      result.user_to._id.toString() === currentUser._id.toString()
        ? result.user_from.mood
        : result.user_to.mood;
    container.lastMessage = null;
    container.requestId = result.chat_request;
    res.send(container);
  };

  fetchMessagesForChat = async (req, res) => {
    let chat_id = req.headers.chat_id;
    let result = await Message.find({chat: chat_id}).populate([
      {path: 'sender', select: 'username _id'},
    ]);

    let map = result.map(item => {
      const container = {};

      container._id = item._id;
      container.username = item.sender.username;
      container.content = item.content.toString();
      container.chatId = item.chat;
      container.senderId = item.sender._id;
      container.created = dateFormat(result.created, 'dd/mm/yyyy HH:MM');

      return container;
    });

    res.send(map);
  };

  sendMessage = async (req, res) => {
    let {currentUser} = req;
    let content = req.headers.content;
    let chatId = req.headers.chat_id;

    let result = await Message.create({
      sender: currentUser._id,
      content: Buffer.from(content, 'utf-8'),
      chat: chatId,
      created: Date.now(),
    });

    const container = {};
    container._id = result._id;
    container.username = currentUser.username;
    container.content = result.content.toString();
    container.chatId = req.headers.chat_id;
    container.senderId = result.sender._id;
    container.created = dateFormat(result.created, 'dd/mm/yyyy HH:MM');

    let chat = await Chat.findOne({_id: chatId});
    let id =
      chat.user_to.toString() === currentUser._id.toString()
        ? chat.user_from.toString()
        : chat.user_to.toString();

    socketConnection.to(id).emit('NEW_MESSAGE', container);

    res.send(container);
  };

  fetchKarma = async (req, res) => {
    let myChats = await Chat.find({user_from: req.headers.creatorid}).exec();
    let messageCount = 0;

    await Promise.all(
      myChats.map(async x => {
        let message = await Message.find({chat: x.id});
        messageCount += message.length;
      })
    );

    let karma = messageCount / 10;
    res.send('' + karma);
  };
}

module.exports = new ChatController();
