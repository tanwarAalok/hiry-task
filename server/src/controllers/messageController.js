const messageService = require('../services/messageService');

exports.getMessages = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { contactId } = req.params;
        const messages = await messageService.getMessages(userId, contactId);
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        const senderId = req.user.id;
        const { receiverId, content } = req.body;
        const newMessage = await messageService.sendMessage(senderId, receiverId, content);
        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};

exports.markMessageAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;
        await messageService.markMessageAsRead(userId, messageId);
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        next(error);
    }
};

exports.uploadMedia = async (req, res, next) => {
    try {
        // console.log(req.body)
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await messageService.uploadMedia(file.buffer);

        res.status(200).json({ url: result.secure_url });
    } catch (error) {
        next(error)
    }
}