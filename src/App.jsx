import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import Signup from './components/Singup';
import EditProfile from './components/EditProfile';
import ChatPage from './components/ChatPage';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setSocket } from './redux/socketSlice';
import { setonlineUser } from './redux/chatSlice';
import ForgetPassword from './components/ForgetPassword';
import OtpVerify from './components/OtpVerify';
import RestePassword from './components/RestePassword';
import { setLikeNotification } from './redux/rtmSlice';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {

  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <ProtectedRoutes><MainLayout /></ProtectedRoutes> , // Main layout with children
      children: [
        {
          path: '/', // Home page route
          element: <ProtectedRoutes><Home /></ProtectedRoutes> 
        },
        {
          path: '/profile/:id', // Profile page route with dynamic user ID
          element: <ProtectedRoutes><Profile /></ProtectedRoutes> 
        },
        {
          path: '/account/edit', // Edit profile page
          element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> 
        },
        {
          path: '/chat', // Chat page route
          element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>  // ChatPage should render here
        }
      ]
    },
    {
      path: '/login', // Login page
      element: <Login />
    },
    {
      path: '/signup',  // Signup page
      element: <Signup />
    },
    {
      path: '/forgetpassword',  // Signup page
      element: <ForgetPassword />
    },{
      path: '/otpverify',  // Signup page
      element: <OtpVerify />
    },{
      path: '/restepassword',  // Signup page
      element: <RestePassword />
    },
  ]);


//redux store in userId or socketId
  const { user } = useSelector((store) => store.auth);
  const {socket} = useSelector((store) => store.socketio);
  const dispatch = useDispatch();

  

  useEffect(() => {
    if (user) {
      // Establish socket connection
      const socketio = io('http://localhost:4000', {
        query: { userId: user?._id },
        transports: ['websocket'],
      });

      // Dispatch socket instance to the redux store
      dispatch(setSocket(socketio));
    } else {
      // Cleanup if no user
      dispatch(setSocket(null));
    }
  }, [user, dispatch])


  useEffect(()=>{
    if(socket){

      console.log("eventEnter")
      // Listen for 'getonlineUsers' event
      socket.on('getOnlineUsers', (onlineUsers) => {
        console.log(onlineUsers, 'onlineUsers');
        
        dispatch(setonlineUser(onlineUsers)); // Update online users in the redux store
      });

      socket.on('nottification', (notification)=>{
        dispatch(setLikeNotification(notification))
      })
      return () => {
        if (socket) {
          socket.disconnect();
        }
        dispatch(setSocket(null)); // Clear socket from the redux store
      };
    }   

  },[socket])
  return (
    <>
      <RouterProvider router={browserRouter} />
      <ToastContainer />
    </>
  );
}

export default App;
