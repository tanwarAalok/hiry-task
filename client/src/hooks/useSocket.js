import { useEffect, useState } from 'react';
import { initSocket, closeSocket } from '../services/socket';

export const useSocket = (token, setOnlineUsers) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if(token){
            const newSocket = initSocket(token, setOnlineUsers);
            setSocket(newSocket);

            return () => {
                closeSocket();
            };
        }
    }, [token]);

    return socket;
};