import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/authSlice';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setMessage } from '../redux/chatSlice';


const ChatPage = () => {
    const [textMessage, setTextMessage] = useState('');
    const { user, suggestedusers, selectedUser } = useSelector((store) => store.auth);
    const { onlineUser, messages } = useSelector((store) => store.chat);
    const dispatch = useDispatch();

    const sendmessage = async (receiverId) => {

        try {
            const token = Cookies.get('accesstoken');
            const headers = { token }
            console.log(textMessage, "messages");

            const response = await axios.post(`http://localhost:4000/api/send/${receiverId}`,
                {textMessage },{headers});

            if (response.data.success) {
                console.log(response.data);
                dispatch(setMessage([...messages,response.data.newmessage]))
                
                setTextMessage('');
                toast.success(response?.data?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null))
        }
    }, [])

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* User List Section */}
            <section className="flex flex-col ml-[16%] h-full w-1/3 border-r border-gray-200">
                <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b">
                    <h1 className="font-bold text-xl">{user?.username}</h1>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {suggestedusers?.length > 0 ? (
                        suggestedusers.map((suggesteduser) => {
                            const isOnline = onlineUser.includes(suggesteduser?._id);
                            return (
                                <div
                                    key={suggesteduser?._id}
                                    onClick={() => dispatch(setSelectedUser(suggesteduser))}
                                    className="flex items-center gap-4 p-3 bg-white mb-2 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer"
                                >
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage
                                            src={suggesteduser?.profilePhoto}
                                            alt={suggesteduser?.username || 'Avatar'}
                                            className="rounded-full object-cover"
                                        />
                                        <AvatarFallback className="bg-gray-300 text-white font-semibold text-lg">
                                            {suggesteduser?.username?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User Info */}
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{suggesteduser?.username || 'Username'}</span>
                                        <span className={`text-sm font-bold ${isOnline ? 'text-green-700' : 'text-red-600'}`}>
                                            {isOnline ? 'online' : 'offline'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">No users available.</p>
                    )}
                </div>
            </section>

            {/* Selected User Chat Section */}
            {selectedUser ? (
                <section className="w-2/3 bg-white shadow-lg p-6">
                    <div className="flex items-center gap-4 border-b pb-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage
                                src={selectedUser?.profilePhoto}
                                alt={selectedUser?.username || 'Profile'}
                                className="rounded-full object-cover"
                            />
                            <AvatarFallback className="bg-gray-300 text-white font-semibold text-lg">
                                {selectedUser?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <h2 className="font-bold text-xl">{selectedUser?.username}</h2>
                    </div>

                    {/* Chat content area */}
                    <Messages selectedUser={selectedUser} />

                    {/* Chat Input Section */}
                    <div className="flex items-center p-4 border-t mt-6">
                        <input
                            type="text"
                            value={textMessage}
                            onChange={(e) => setTextMessage(e.target.value)}
                            className="flex-1 p-2 mr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your message..."
                        />
                        <button
                            onClick={() => sendmessage(selectedUser._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Send
                        </button>
                    </div>
                </section>
            ) : (
                <div className="w-2/3 bg-gray-100 flex flex-col items-center justify-center text-center">
                    <MessageCircleCode className="w-32 h-32 text-gray-400" />
                    <h1 className="text-xl font-semibold mt-4 text-gray-700">Your Messages</h1>
                    <span className="text-gray-500">Send a message to start a chat.</span>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
