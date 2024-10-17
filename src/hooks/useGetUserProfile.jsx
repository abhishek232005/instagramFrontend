import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserProfile } from '../redux/authSlice'

const useGetUserProfile = (userId) => {

    const dispatch = useDispatch()
    useEffect(()=>{
       const fetchUserProfile = async ( )=>{
           try {
               const token = Cookies.get("accesstoken")
               console.log('Token:', token);
             
               let headers = {
                 'token':token
              }
              console.log(headers);
              
               if (!token) {
                 alert('No token found. Please login again.');
                 return; // Exit the function if no token
               }
               const response = await axios.get(`http://localhost:4000/api/${userId}/profile`,{headers:headers})
               if(response.data.success){
                   console.log(response.data);
                    dispatch(setUserProfile(response.data.user))
               }
           } catch (error) {
               console.log(error);
               
           }
       }
       fetchUserProfile()
    },[userId])
}

export default useGetUserProfile