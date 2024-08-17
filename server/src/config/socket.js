const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const messageService = require('../services/messageService')
const contactService = require('../services/contactService')

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST'],
        },
    });

    const userSockets = new Map();
    const onlineUsers = new Set();

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next(new Error('Authentication error'));
            socket.userId = decoded.id;
            next();
        });
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.userId);
        userSockets.set(socket.userId, socket);
        onlineUsers.add(socket.userId);

        io.emit('userStatus', [...onlineUsers]);


        socket.on('typing', ({ receiverId, isTyping }) => {
            const receiverSocket = userSockets.get(receiverId);
            if (receiverSocket) {
                receiverSocket.emit('userTyping', { userId: socket.userId, isTyping });
            }
        });

        socket.on('new_message', async (messageData) => {
            console.log(messageData)
            try {
                const { senderId, receiverId  } = messageData;
                const savedMessage = await messageService.sendMessage(messageData);

                const senderSocket = userSockets.get(senderId);
                const receiverSocket = userSockets.get(receiverId);

                const isNewChat = await contactService.isNewContact(senderId, receiverId);
                if (isNewChat) {
                    await contactService.addContact(senderId, receiverId);
                    await contactService.addContact(receiverId, senderId);
                }

                senderSocket.emit('message', savedMessage);

                if (receiverSocket) {
                    receiverSocket.emit('message', savedMessage);
                    const unreadCount = await messageService.getUnreadMessageCount(senderId, receiverId);
                    receiverSocket.emit('unread_count_update', {
                        senderId,
                        unreadCount
                    });
                }


            } catch (error) {
                console.error('Error handling new message:', error);
                socket.emit('message_error', { message: 'Failed to send message' });
            }
        });

        socket.on('mark_messages_read', async ({senderId, receiverId}) => {
            // Update your database to mark messages as read
            await messageService.markMessageAsRead(senderId, receiverId);

            // Optionally, emit an event back to update the sender's UI
            // const senderSocket = userSockets.get(senderId);
            // if (senderSocket) {
            //     io.to(senderSocket.id).emit('messages_read_by_receiver', {receiverId});
            // }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.userId);
            userSockets.delete(socket.userId);
            onlineUsers.delete(socket.userId);
            io.emit('userStatus', [...onlineUsers]);
        });
    });

    return { io, userSockets };
};

module.exports = setupSocket;