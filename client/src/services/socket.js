import { io } from 'socket.io-client';

let socket;

export const initSocket = (token, setOnlineUsers) => {
    socket = io('http://localhost:5000', {
        auth: { token }
    });

    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');

    });

    socket.on('userStatus', (onlineUsers) => {
        setOnlineUsers(onlineUsers)
    })

    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket not initialized. Call initSocket first.');
    }
    return socket;
};

export const closeSocket = () => {
    if (socket) {
        socket.close();
    }
};