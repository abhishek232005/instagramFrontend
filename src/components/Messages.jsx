import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useGetAllMessages from '../hooks/useGetAllMessages';
import useGetRTM from '../hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessages();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="overflow-y-auto flex-1 p-4 bg-gray-100 rounded-lg shadow-inner">
      {/* User Info Section */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src={selectedUser?.profilephoto} alt="Profile" className="rounded-full" />
            <AvatarFallback className="bg-gray-300 text-white">CN</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-lg">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              View Profile
            </button>
          </Link>
        </div>
      </div>

      {/* Messages Section */}
      <div className="space-y-4 px-4 pb-4">
        {messages && messages.map((msg) => (
          <div
            key={msg._id} // Ensure _id is unique
            className={`flex ${msg.sender === user?._id ? 'justify-end' : 'justify-start'} mb-2`} // Added margin between messages
          >
            <div
              className={`p-3 max-w-xs md:max-w-md lg:max-w-lg rounded-lg shadow-md ${
                msg.sender === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
              }`}
              style={{ wordWrap: 'break-word' }} // Ensure text wraps properly
            >
              {msg.message} {/* Adjust field name based on your message structure */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
