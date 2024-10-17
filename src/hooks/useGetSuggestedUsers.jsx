import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { setSuggestedUsers } from '../redux/authSlice'

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch()
    useEffect(()=>{
       const fetchSuggestedUsers = async ( )=>{
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
               const response = await axios.get(`http://localhost:4000/api/suggested`,{headers:headers})
               if(response.data.success){
                   console.log(response.data);
                    dispatch(setSuggestedUsers(response.data.users))
               }
           } catch (error) {
               console.log(error);
               
           }
       }
       fetchSuggestedUsers()
    },[])
}

export default useGetSuggestedUsers