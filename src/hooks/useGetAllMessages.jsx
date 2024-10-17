import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setMessage } from '../redux/chatSlice'
import Cookies from 'js-cookie'
const useGetAllMessages = () => {
    const dispatch = useDispatch()
    const { selectedUser} = useSelector(store=>store.auth)

    useEffect(()=>{
        const fetchAllMessage = async ()=>{
            try {
                const token = Cookies.get("accesstoken")
                console.log('Token:', token);
                const headers = {token}
                const res = await axios.get(`http://localhost:4000/api/all/${ selectedUser?._id}`,{headers:headers})
                if(res.data.success){
                    console.log(res.data.messages);
                    dispatch(setMessage(res.data.messages))
                    
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllMessage()
    },[selectedUser])
 
}

export default useGetAllMessages