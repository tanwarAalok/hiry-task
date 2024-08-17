import React, {useEffect, useRef, useState} from 'react';
import {
    ArrowLeftIcon,
    LogoutIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    SearchIcon,
    UserAddIcon,
    XIcon
} from '@heroicons/react/outline';
import {
    getNonContactUsers,
    getMessages,
    getUserContacts,
    updateBlockStatus,
    updateArchiveStatus, getContactById, uploadMedia
} from "../services/api.js";
import useScroll from "../hooks/useScroll.js";
import {getTimePassed, getFirstName, checkOnline} from "../../utils.js";
import DropDownMenu from "./DropDownMenu.jsx";


const Chat = ({socket, user, onlineUsers, onLogout}) => {
    const [filter, setFilter] = useState('All');
    const [message, setMessage] = useState('');
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chat, setChat] = useState([]);
    const [typingResult, setTypingResult] = useState(null);
    const [isAddingContact, setIsAddingContact] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const fileInputRef = useRef(null);
    const [loadingFile, setLoadingFile] = useState(false)

    const chatContainerRef = useScroll(chat);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const data = await getUserContacts(user.id);
            const sortedContacts = data.sort((a, b) => {
                const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt) : new Date(0);
                const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt) : new Date(0);
                return dateB - dateA;
            });

            setContacts(sortedContacts);
            setFilteredContacts(sortedContacts);
            const usersData = await getNonContactUsers();
            setOtherUsers(usersData.filter(u => u.id !== user.id));
            setLoading(false);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [socket])


    useEffect(() => {
        let filtered = contacts;

        if (filter === 'Unread') {
            filtered = filtered.filter(contact => contact.unreadCount > 0);
        } else if (filter === 'Archived') {
            filtered = filtered.filter(contact => contact.archived);
        } else if (filter === 'Blocked') {
            filtered = filtered.filter(contact => contact.blocked);
        }

        if (searchTerm) {
            filtered = filtered.filter(contact =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredContacts(filtered);
    }, [filter, contacts, searchTerm]);

    useEffect(() => {
        if (socket) {
            socket.on('message', async (new_message) => {
                if(selectedChat && new_message.senderId === selectedChat.id || new_message.senderId === user.id) {
                    const blockedUsers = contacts.filter(contact => contact.blocked);
                    const isBlocked = blockedUsers.some(blockedUser => blockedUser.id === new_message.senderId);
                    if(!isBlocked) setChat([...chat, new_message])
                }
                await fetchContacts()
            });

            socket.on('userTyping', (data) => setTypingResult(data));

            socket.on('unread_count_update', ({senderId, unreadCount}) => {
                setContacts(prevContacts => prevContacts.map(contact =>
                    contact.id === senderId ? {...contact, unreadCount} : contact
                ));
            });

            return () => {
                socket.off('message');
                socket.off('userTyping')
                socket.off('unread_count_update')
            };
        }

    }, [socket, chat]);

    const handleSelectedChat = async (contact) => {
        setSelectedChat(contact)
        try{
            const data = await getMessages(contact.id);
            setChat(data)

            setContacts(prevContacts => prevContacts.map(c =>
                c.id === contact.id ? {...c, unreadCount: 0} : c
            ));

            socket.emit('mark_messages_read', {senderId: contact.id, receiverId: user.id});
        } catch (err) {
            console.log(err)
        }
    }

    const handleSendMessage =  (e, contactId) => {
        e.preventDefault();
        if(message){
            socket.emit('new_message', {
                senderId: user.id,
                receiverId: contactId,
                content: message,
            })

            console.log("message emitted")
            setIsAddingContact(false);
            setFile(null);
            setPreviewURL(null);
            setMessage('');
            setTypingResult(null);
        }
    }

    const handleTyping = (receiverId) => {
        if(socket && user){
            socket.emit('typing', {
                isTyping: message.length > 1,
                receiverId,
            })
        }
    }

    const handleBlockUser = async (contactId, blocked) => {
        await updateBlockStatus(contactId, blocked)
        const contact = await getContactById(contactId);
        setSelectedChat(contact)
        await fetchContacts()
    }

    const handleArchiveUser = async (contactId, archived) => {
        await updateArchiveStatus(contactId, archived)
        const contact = await getContactById(contactId);
        setSelectedChat(contact)
        await fetchContacts();
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const formData = new FormData();
            formData.append('file', file);

            setLoadingFile(true)

            try {
                const data = await uploadMedia(formData)

                if (data) {
                    setPreviewURL(data.url);  // Use this URL to show preview
                    setMessage(data.url); // This sets the message to the file's URL for sending
                } else {
                    console.error('Upload failed:', data.error);
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
            finally {
                setLoadingFile(false)
            }
        }
    };


    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className="w-1/3 flex flex-col">
                <div className="p-4 border-b h-20 flex justify-between items-center">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400"/>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            type="text"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddingContact(!isAddingContact)}
                        className="ml-2 p-2 bg-orange-500 text-white rounded-full"
                    >
                        {isAddingContact ? (
                            <ArrowLeftIcon className="h-5 w-5"/>
                        ) : (
                            <UserAddIcon className="h-5 w-5"/>
                        )}
                    </button>
                    <button onClick={onLogout} className="ml-2 p-2 bg-orange-500 text-white rounded-full">
                        <LogoutIcon className="h-5 w-5"/>
                    </button>
                </div>
                {
                    isAddingContact ? '' : (
                        <div className="flex space-x-2 px-4 pb-2 mt-3">
                            {['All', 'Unread', 'Archived', 'Blocked'].map((item) => (
                                <button
                                    key={item}
                                    className={`px-3 py-1 rounded-full text-sm border ${
                                        filter === item ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                                    }`}
                                    onClick={() => setFilter(item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )
                }

                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="p-4 text-gray-500 flex items-center justify-center">
                            <span>Loading Contacts...</span>
                        </div>
                    ) : (isAddingContact ? otherUsers : filteredContacts).length > 0 ? (
                        (isAddingContact ? otherUsers : filteredContacts).map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => handleSelectedChat(contact)}
                                className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer border-l-4 border-transparent hover:border-orange-500 ${selectedChat?.id === contact.id ? 'bg-gray-100' : ''}`}
                            >
                                <img
                                    src={contact.image}
                                    alt={contact.name}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div className="flex-1 relative">
                                    <div className="flex gap-4 items-center">
                                        <h3 className="font-semibold">{contact.name}</h3>
                                        <span
                                            className={`rounded-full w-1.5 h-1.5 ${
                                                checkOnline(onlineUsers, contact.id) ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                        ></span>
                                        {!contact.blocked && contact.lastMessage ? (
                                            <span className="text-xs text-gray-500">
                                                {getTimePassed(contact.lastMessage.createdAt)}
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                        {
                                            !contact.blocked && contact.unreadCount > 0 ? (
                                                <div className="absolute right-1 top-1 rounded-full bg-orange-500 text-white text-xs px-2 py-1">{contact.unreadCount}</div>
                                            ) : ''
                                        }
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {
                                            contact.blocked ? (
                                                <>
                                                    <span className="text-gray-400 mr-1">
                                                        {getFirstName(user.name)}:
                                                    </span>
                                                    User blocked
                                                </>
                                            ) : contact.lastMessage ? (
                                                <>
                                                <span className="text-gray-400 mr-1">
                                                    {getFirstName(contact.lastMessage.senderName)}:
                                                </span>
                                                    {contact.lastMessage.content}
                                                </>
                                            ) : (
                                                ''
                                            )
                                        }

                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-gray-500">
                            {isAddingContact ? 'No users available to add.' : (
                                <div className="flex flex-col gap-4 items-center justify-center w-full">
                                    <p className="text-md text-gray-500">Get started with chat by adding new contact</p>
                                    <button
                                        onClick={() => setIsAddingContact(!isAddingContact)}
                                        className="p-2 bg-orange-500 text-white rounded"
                                    >
                                        Add New Contact
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* Chat window */}
            <div className="flex-1 flex flex-col border-l">
                {!selectedChat ? (
                    <img src="/chat-bg.jpg" alt="chat" className="w-full h-full"/>
                ) : (
                    <>
                        <div className="bg-gray-100 p-4 flex items-center justify-between border-b h-20">
                            <div className="flex items-center">
                                <img src={selectedChat.image} alt={selectedChat.name}
                                     className="w-10 h-10 rounded-full mr-3"/>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h2 className="font-semibold">{selectedChat.name}</h2>
                                        <span
                                            className={`rounded-full w-1.5 h-1.5 ${checkOnline(onlineUsers, selectedChat.id) ? 'bg-green-500' : 'bg-gray-300'}`}></span>

                                    </div>
                                    {
                                        typingResult && typingResult.userId === selectedChat.id && typingResult.isTyping &&
                                        <p className="text-sm text-gray-400">Typing...</p>
                                    }

                                </div>
                            </div>
                            <DropDownMenu contact={selectedChat} onBlock={handleBlockUser} onArchive={handleArchiveUser}/>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-white" ref={chatContainerRef}>
                            {
                                chat.length > 0 ? (

                                    chat.map((chat) => (
                                        <div key={chat.id} className={`mb-4 ${chat.senderId === user.id ? 'text-right' : ''}`}>
                                            {chat.content.startsWith('http') ? (
                                                chat.content.endsWith('.mp4') ? (
                                                    <div
                                                        className={`flex ${chat.senderId === user.id ? 'justify-end' : ''}`}>
                                                        <video src={chat.content} controls className="max-w-xs"/>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`flex ${chat.senderId === user.id ? 'justify-end' : ''}`}>
                                                        <img src={chat.content} alt="Sent media" className="max-w-xs"/>
                                                    </div>
                                                )
                                            ) : (
                                                <p
                                                    className={`rounded-lg p-3 inline-block max-w-xl ${chat.senderId === user.id ? 'bg-orange-500 text-white' : 'bg-gray-100 '}`}
                                                >
                                                    {chat.content}
                                                </p>
                                            )}
                                        </div>

                                    ))
                                ) : (
                                    <div className="w-full h-full grid place-items-center">
                                        Start Chatting !
                                    </div>
                                )
                            }
                            {
                                selectedChat.blocked ? (
                                    <div className="mb-4 text-center">
                                        <p className="rounded-lg p-3 inline-block max-w-xl">User Blocked</p>
                                    </div>
                                ) : ''
                            }
                        </div>

                        {
                            !selectedChat.blocked ? (
                                <div className="bg-white p-5 px-10 border-t">
                                    <form className="relative" onSubmit={(e) => handleSendMessage(e, selectedChat.id)}>
                                        {previewURL && (
                                            <div className="mb-2 grid place-items-center">
                                                {file.type.startsWith('image/') ? (
                                                    <img src={previewURL} alt="Preview" className="max-w-xs"/>
                                                ) : file.type.startsWith('video/') ? (
                                                    <video src={previewURL} controls className="max-w-xs"/>
                                                ) : (
                                                    <p>Unsupported file type</p>
                                                )}
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            placeholder="Type your message here"
                                            className="w-full p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-100"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={() => handleTyping(selectedChat.id)}
                                            disabled={previewURL}
                                        />
                                        <div className="flex items-center gap-6 absolute right-2 top-2">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*,video/*"
                                            />
                                            {
                                                previewURL ? (
                                                    <XIcon
                                                        className="h-6 w-6 text-orange-500 cursor-pointer"
                                                        onClick={() => {
                                                            setFile(null)
                                                            setPreviewURL(null)
                                                            setMessage('')
                                                        }}
                                                    />
                                                ) : (
                                                    <PaperClipIcon
                                                        aria-disabled={loadingFile}
                                                        className="h-6 w-6 text-orange-500 cursor-pointer"
                                                        onClick={() => fileInputRef.current.click()}
                                                    />
                                                )
                                            }

                                            <button
                                                type="submit"
                                                disabled={loadingFile}
                                                className="flex items-center justify-center h-10 w-10 bg-orange-400 rounded-lg">
                                                <PaperAirplaneIcon className="h-6 w-6 text-orange-500 cursor-pointer transform rotate-90"/>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : ''
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;