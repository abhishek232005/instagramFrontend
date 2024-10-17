import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../redux/authSlice';
import Createposts from './Createposts';
import Cookies from 'js-cookie';
import { setPosts, setSelectedPost } from '../redux/postSlice';
import { Button, Popover } from 'react-bootstrap';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);

  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    Cookies.remove('accesstoken');
    dispatch(setAuthUser(null));
    dispatch(setSelectedPost(null));
    dispatch(setPosts([]));
    navigate('/login');
  };

  const sidebarHandler = (texttype) => {
    if (texttype === 'Logout') {
      logoutHandler();
    } else if (texttype === 'Create') {
      setOpen(true);
    } else if (texttype === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (texttype === 'Home') {
      navigate('/');
    } else if (texttype === 'Messages') {
      navigate('/chat');
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <TrendingUp />, text: 'Explore' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notifications' },
    { icon: <PlusSquare />, text: 'Create' },
    {
      icon: (
        <Avatar
          round={true} // Makes it a circle
          size="40" // Sets the size of the avatar
          src={user?.profilePhoto} // Use the user's profile photo
          alt="Profile"
        />
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-6 border-r border-gray-300 w-[18%] h-screen bg-white shadow-md">
      <div className="flex flex-col py-4">
        <h1 className="my-8 pl-3 font-bold text-2xl text-blue-600">LoGo</h1>
        <div className="space-y-4">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 transition duration-200 ease-in-out"
            >
              {item.icon}
              <span className="text-base font-medium">{item.text}</span>
              {
                item.text === 'Notifications' && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size={'icon'}
                        className="rounded-full h-5 w-5 bg-red-600 text-white absolute bottom-6 left-6 flex items-center justify-center text-xs"
                      >
                        {likeNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 bg-white rounded-lg shadow-lg">
                      <div>
                        {
                          likeNotification.length === 0 ? (
                            <p>No New Notification</p>
                          ) : (
                            likeNotification.map((notification) => (
                              <div key={notification.userId} className="flex items-center gap-2 p-2">
                                <Avatar round={true} size="30" src={notification.userDetails?.profilePhoto} />
                                <p className="text-sm">
                                  <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                                </p>
                              </div>
                            ))
                          )
                        }
                      </div>
                    </PopoverContent>
                  </Popover>
                )
              }
            </div>
          ))}
        </div>
      </div>
      <Createposts open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
