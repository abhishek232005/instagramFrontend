import React, { useState } from 'react';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge,  } from 'react-bootstrap';
import { Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  // Set default to 'posts' instead of 'post'
  const [activeTab, setActiveTab] = useState('posts');

  const { userprofile , user} = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userprofile?._id
  const isFollowing = false;

  const handleTagChange = (tab) => {
    setActiveTab(tab);
  };

  // Display posts or bookmarks depending on the active tab
  const displayedPost = activeTab === 'posts' ? userprofile?.posts : userprofile?.bookmarks;

  console.log(displayedPost, "displayedPost");

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto py-10">
      {/* Avatar and User Information */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md">
          <AvatarImage
            src={userprofile?.profilePhoto}
            alt={userprofile?.username || 'profile photo'}
            className="rounded-full object-cover"
          />
          <AvatarFallback className="bg-gray-400 text-white text-2xl font-semibold">
            {userprofile?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {userprofile?.username || 'Username'}
          </h1>
          <p className="text-gray-500 mt-2">
            {userprofile?.bio || 'This is your bio...'}
          </p>
        </div>
      </div>

      {/* Conditional Rendering: Buttons Section */}
      {isLoggedInUserProfile ? (
        <div className="flex gap-4 mt-6">
          <Link to={'/account/edit'}> <button className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors">
            Edit Profile ✏️
          </button></Link>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 transition-colors">
            View Archive 📂
          </button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-md font-semibold hover:bg-yellow-600 transition-colors">
            Ad Tools 📈
          </button>
        </div>
      ) : (
        isFollowing ? (
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 transition-colors">
              Unfollow ❌
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors">
              Message ✉️
            </button>
          </div>
        ) : (
          <button className="px-4 py-2 mt-6 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors">
            Follow ➕
          </button>
        )
      )}

      {/* Other Profile Info */}
      <div className="mt-6 flex items-center gap-4 text-gray-700">
        <p className="font-semibold">{userprofile?.posts.length} <span>Posts 📝</span></p>
        <p className="font-semibold">{userprofile?.followers.length} <span>Followers 👥</span></p>
        <p className="font-semibold">{userprofile?.following.length} <span>Following 👣</span></p>
      </div>

      {/* Bio and Badge Section */}
      <div className="mt-4 flex flex-col items-center gap-4 text-center">
        <p className="font-semibold text-gray-600">{userprofile?.bio || "Bio here..."}</p>
        <Badge className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2 text-sm inline-flex items-center">
          <span>@{userprofile?.username}</span>
        </Badge>

        {/* Profile Details Section with Emojis */}
        <div className="mt-4 text-gray-600 space-y-2">
          <p className="font-medium inline-flex items-center">
            🖥️ Learn code with Abhishek Developer
          </p>
          <p className="font-medium">🎮 Turning code into fun</p>
          <p className="font-medium">📩 DM for code collaboration</p>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-t-gray-200 w-full mt-4">
          <div className="flex items-center justify-center gap-10 text-sm text-gray-600">
            <span
              className={`py-3 cursor-pointer transition-colors ${activeTab === 'posts' ? 'font-bold text-gray-900' : 'hover:text-gray-900'}`}
              onClick={() => handleTagChange('posts')}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer transition-colors ${activeTab === 'saved' ? 'font-bold text-gray-900' : 'hover:text-gray-900'}`}
              onClick={() => handleTagChange('saved')}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer transition-colors ${activeTab === 'reels' ? 'font-bold text-gray-900' : 'hover:text-gray-900'}`}
              onClick={() => handleTagChange('reels')}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer transition-colors ${activeTab === 'tags' ? 'font-bold text-gray-900' : 'hover:text-gray-900'}`}
              onClick={() => handleTagChange('tags')}
            >
              TAGS
            </span>
          </div>

          {/* Posts Grid Section */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {displayedPost?.map((post) => (
              <div key={post?._id} className="relative group cursor-pointer">
                <img
                  src={post.image || 'path/to/placeholder.jpg'}
                  alt="postimage"
                  className="w-full my-2 rounded-sm aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4 opacity-0 group-hover:opacity-100">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart className="w-5 h-5" />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
