import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className="w-full max-w-[8rem] my-3 pr-4">
      <div className="flex items-center gap-3 bg-white shadow-md p-1 rounded-lg">
        {/* Avatar */}
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12 rounded-full border border-gray-300 hover:scale-105 transition-transform duration-150">
            <AvatarImage src={user?.profilePhoto} alt={user?.username} className="rounded-full object-cover" />
            <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Username and Bio */}
        <div className="flex flex-col justify-center">
          <Link to={`/profile/${user?._id}`}>
            <h5 className="text-base font-semibold text-gray-900 hover:underline transition-colors">
              {user?.username}
            </h5>
          </Link>
          <p className="text-xs text-gray-500 mt-1 leading-tight">
            {user?.bio || 'This is your bio...'}
          </p>
        </div>
      </div>

      {/* Suggested Users Section */}
      <SuggestedUsers/>
    </div>
  );
};

export default RightSidebar;
