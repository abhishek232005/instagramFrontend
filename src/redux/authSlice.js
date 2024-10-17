import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedusers:[],
        userprofile:null,
        selectedUser:null
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.user = action.payload
        },
        setSuggestedUsers:(state,action ) =>{
            state.suggestedusers = action.payload
        },
        setUserProfile:(state,action) =>{
            state.userprofile = action.payload
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload
        }
    }
})

export const {setAuthUser,setSuggestedUsers,setUserProfile,setSelectedUser} = authslice.actions
export default authslice.reducer