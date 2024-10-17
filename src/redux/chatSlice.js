import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUser: [],
        messages: [],
    },
    reducers: {
        // Set online users
        setonlineUser: (state, action) => {
            state.onlineUser = action.payload;
        },
        // Append new messages to the existing messages array
        setMessage: (state, action) => {
            state.messages =  action.payload
        },
      
    },
});

export const { setonlineUser, setMessage,  } = chatSlice.actions;
export default chatSlice.reducer;
