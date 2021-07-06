const {Chat, Message} = require('../Schemas/index.js');
var ObjectId = require('mongoose').Types.ObjectId;
var dateFormat = require('dateformat');

class ChatController {
    fetchChats = async (req, res) => {
        let { currentUser } = req;
        let result = await Chat.find( {$or:[
                {user_from: currentUser._id}, {user_to: currentUser._id}
                ]})
            .populate("user_from", "username")
            .populate("user_to", "username")


        let map = await Promise.all(result.map( async item => {
            const container = {};

            let message = await Message.findOne({chat: item._id}).sort('-created')
                .populate([{path:'sender', select:'username _id'}])
            let container_mesage = {}
            container_mesage._id = message._id;
            container_mesage.username = message.sender.username;
            container_mesage.content = message.content.toString();
            container_mesage.chatId = message.chat;
            container_mesage.senderId = message.sender._id
            container_mesage.created = dateFormat(message.created, "dd/mm/yyyy HH:MM");

            container._id = item._id;
            container.username = item.user_to.username===currentUser.username?
                item.user_from.username:item.user_from.username;
            container.mood = item.user_from.mood
            container.lastMessage = container_mesage
            container.requestId = item.chat_request;

            return container;
        }));
        res.send(map
        );
    };

    createChat = async (req, res) => {
        let requestId = req.body.requestId;
        let userFromId = req.body.userFromId;
        let userToId = req.body.userToId;

        let result = await Chat.create({chat_request: requestId, user_from: userFromId, user_to: userToId})
        res.send(result);
    };

    fetchMessagesForChat = async (req, res) => {
        let chat_id = req.headers.chat_id;
        let result = await Message.find({chat: chat_id})
            .populate([{path:'sender', select:'username _id'}])

        let map = result.map(item => {
            const container = {};

            container._id = item._id;
            container.username = item.sender.username;
            container.content = item.content.toString();
            container.chatId = item.chat;
            container.senderId = item.sender._id
            container.created = dateFormat(result.created, "dd/mm/yyyy HH:MM");

            return container;
        })

        res.send(map
        );
    };

    sendMessage = async (req, res) => {
        let { currentUser } = req;
        let content = req.headers.content;
        let chatId = req.headers.chat_id;

        let result = await Message.create({
            sender: currentUser._id,
            content: Buffer.from(content,'utf-8'),
            chat: chatId,
            created: Date.now()})


        const container = {};
        container._id = result._id;
        container.username = currentUser.username;
        container.content = result.content.toString();
        container.chatId = req.headers.chat_id;
        container.senderId = result.sender._id
        container.created = dateFormat(result.created, "dd/mm/yyyy HH:MM");

        let chat = await Chat.findOne({_id: chatId})
        let id = (chat.user_to.toString() === currentUser._id.toString()
            ?chat.user_from.toString()
            :chat.user_to.toString());

            socketConnection.to(id)
            .emit("NEW_MESSAGE", container)

        res.send(container);
    }
}

module.exports = new ChatController();
