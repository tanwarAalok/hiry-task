import React, {useEffect, useState} from 'react';
import Chat from "./components/Chat.jsx";
import Login from "./components/Login.jsx";
import {useSocket} from "./hooks/useSocket.js";
import {closeSocket} from "./services/socket.js";
import {loginUser, registerUser} from "./services/api.js";
import Register from "./components/Register.jsx";
import toast from "react-hot-toast";


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [loginResponse, setLoginResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    const socket = useSocket(loginResponse?.token, setOnlineUsers);

    useEffect(() => {
        return () => {
            if (socket) {
                closeSocket();
            }
        };
    }, [socket]);

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { token, user } = await loginUser(email, password);
            localStorage.setItem('token', token);
            toast.success("User login successfully");
            setLoginResponse({token, user})
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.message || err.error.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (body) => {
        setLoading(true);
        setError(null);
        try {
            await registerUser(body);
            setIsRegistering(false);
            toast.success('User registered successfully.');
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setLoginResponse(null);
        closeSocket();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isLoggedIn && !socket) {
        return <div>Connecting to chat...</div>;
    }

    return (
        <div>
            {isLoggedIn ? (
                <Chat socket={socket} user={loginResponse.user} onlineUsers={onlineUsers} onLogout={handleLogout}/>
            ) : isRegistering ? (
                <Register onRegister={handleRegister} error={error} setIsRegistering={setIsRegistering}/>
            ) : (
                <Login onLogin={handleLogin} error={error} setIsRegistering={setIsRegistering}/>
            )}
        </div>
    );
};

export default App;