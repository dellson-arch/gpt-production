const chatModel = require('../models/chat.model')
const messageModel = require('../models/message.model')

async function createChat(req,res){
    console.log('createChat called with title:', req.body.title);
    console.log('User:', req.user._id);
    
    const{title} = req.body
    const user = req.user

    const chat = await chatModel.create({
        user : user._id,
        title
    })

    console.log('Chat created:', chat);

    res.status(201).json({
        message: "chat created successfully",
        chat:{
            id : chat._id,
            title:chat.title,
            lastActivity: chat.lastActivity,
            user : chat.user 
        }
    })
}

async function getChats(req,res){
    const user = req.user
    const chats = await chatModel.find({user:user._id})
    res.status(200).json({
        message : "chats fetched successfully",
        chats : chats.map(chat=>({
            id : chat._id,
            title:chat.title,
            lastActivity: chat.lastActivity,
            user : chat.user 
        }))
    })
}

async function getChatMessages(req, res) {
    try {
        const { chatId } = req.params;
        const user = req.user;
        
        // First verify the chat belongs to the user
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Get messages for this chat
        const messages = await messageModel.find({ chat: chatId })
            .sort({ createdAt: 1 }) // Oldest first
            .lean();
        
        // Format messages for frontend
        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            content: msg.content,
            role: msg.role,
            timestamp: msg.createdAt
        }));
        
        res.status(200).json({
            message: "Messages fetched successfully",
            messages: formattedMessages
        });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({ message: "Error fetching messages" });
    }
}

async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;
        const user = req.user;
        
        // First verify the chat belongs to the user
        const chat = await chatModel.findOne({ _id: chatId, user: user._id });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        
        // Delete all messages associated with this chat
        await messageModel.deleteMany({ chat: chatId });
        
        // Delete the chat itself
        await chatModel.findByIdAndDelete( chatId );
        
        res.status(200).json({
            message: "Chat deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: "Error deleting chat" });
    }
}

module.exports = {createChat , getChats, getChatMessages, deleteChat}