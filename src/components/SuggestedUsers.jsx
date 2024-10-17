import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { setSuggestedUsers } from '../redux/authSlice';  // Assuming there's a redux slice for auth

const SuggestedUsers = () => {
  const { suggestedusers } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const followOrUnfollowHandler = async (suggestedUserId) => {
    try {
      const token = Cookies.get('accesstoken');
      const headers = { token };

      const response = await axios.post(
        `http://localhost:4000/api/followOrUnfollow/${suggestedUserId}`,
        {},
        { headers }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        // Update the state locally or via redux to reflect the follow/unfollow change
        const updatedSuggestedUsers = suggestedusers.map(user =>
          user._id === suggestedUserId
            ? { ...user, isFollowing: !user.isFollowing }
            : user
        );
        dispatch(setSuggestedUsers(updatedSuggestedUsers));
      }
    } catch (error) {
      console.error('Follow/Unfollow error:', error);
      toast.error(error.response?.data?.message || 'Failed to follow/unfollow.');
    }
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-gray-700 text-sm">Suggested for You</h1>
        <span className="font-medium text-blue-500 cursor-pointer hover:text-blue-400 text-xs">See All</span>
      </div>

      {/* Suggested Users */}
      {
        suggestedusers?.map(user => (
          <div key={user._id} className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="w-10 h-10 rounded-full border border-gray-200 hover:scale-105 transition-transform duration-150">
                  <AvatarImage src={user?.profilePhoto} alt={user?.username} className="rounded-full object-cover" />
                  <AvatarFallback className="bg-gray-400 text-white text-lg font-semibold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {/* Username and Bio */}
              <div className="flex flex-col">
                <Link to={`/profile/${user?._id}`} className="hover:underline">
                  <h5 className="text-sm font-medium text-gray-800">{user?.username}</h5>
                </Link>
                <p className="text-xs text-gray-500">{user?.bio || 'This is your bio...'}</p>
              </div>
            </div>

            {/* Follow/Unfollow Button */}
            <div className="flex items-center justity-between">
              <span
                onClick={() => followOrUnfollowHandler(user._id)}
                className={`text-xs font-bold cursor-pointer ${
                  user.isFollowing ? 'text-red-500 hover:text-red-400' : 'text-blue-500 hover:text-blue-400'
                }`}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </span>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default SuggestedUsers;
