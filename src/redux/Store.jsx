import { combineReducers, configureStore } from "@reduxjs/toolkit";
// copy kare ka la ka lana hai redux toolkit sa getstart pa jan par redux toolkit poersist pa jan hai
import authSlice from "./authSlice";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  // copy kare ka la ka lana hai redux toolkit sa getstart pa jan par redux toolkit poersist pa jan hai
  import storage from 'redux-persist/lib/storage'
import postSlice from "./postSlice";
import socketSlice from "./socketSlice";
import chatSlice from "./chatSlice";
import rtmSlice from './rtmSlice'

  
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    realTimeNotification:rtmSlice
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default store