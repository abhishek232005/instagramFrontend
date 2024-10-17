import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
    name: 'post',
    initialState:{
         post_find:[],
         selectePost:null,
    },
    reducers:{
        // actions
        setPosts:(state,action) =>{
            state. post_find = action.payload
        },
        setSelectedPost: (state,action) =>{
            state.selectePost = action.payload
        }
    }
})

export const {setPosts, setSelectedPost} = postSlice.actions
export default postSlice.reducer