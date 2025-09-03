const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const chatController = require('../controller/chat.controller')

const router = express.Router();

/* POST /api/chat/ */
router.post('/' , authMiddleware.authuser, chatController.createChat)

/* GET */
router.get('/' , authMiddleware.authuser, chatController.getChats)

/* GET messages for a specific chat */
router.get('/:chatId/messages', authMiddleware.authuser, chatController.getChatMessages)

/* DELETE a specific chat */
router.delete('/:chatId', authMiddleware.authuser, chatController.deleteChat)

module.exports = router