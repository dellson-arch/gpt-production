import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['chat/addMessage', 'chat/createNewChat'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['chat.chats'],
      },
    }),
});
