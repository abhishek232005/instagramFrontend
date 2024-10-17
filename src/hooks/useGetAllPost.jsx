import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPosts } from '../redux/postSlice'
import Cookies from 'js-cookie'

const useGetAllPost = () => {
    const dispatch = useDispatch()
 useEffect(()=>{
    const fetchAllpost = async ( )=>{
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
            const response = await axios.get(`http://localhost:4000/api/all`,{headers:headers})
            if(response.data.success){
                console.log(response.data);
                 dispatch(setPosts(response.data.post_find))
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    fetchAllpost()
 },[])
}

export default useGetAllPost