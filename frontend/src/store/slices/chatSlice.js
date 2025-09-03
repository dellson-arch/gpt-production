import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Async thunk for sending messages to AI
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message) => {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    const data = await response.json();
    return data;
  }
);

const initialState = {
  chats: [],
  currentChatId: null,
  showNewChatPrompt: false,
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createNewChat: (state, action) => {
      console.log('createNewChat called with prompt:', action.payload);
      const prompt = action.payload || '';
      const newChat = {
        _id: Date.now().toString(), // Use _id to match backend structure
        title: prompt || 'New Chat',
        timestamp: new Date().toISOString().split('T')[0],
        messages: []
      };
      
      console.log('Creating new chat in store:', newChat);
      state.chats.unshift(newChat);
      state.currentChatId = newChat._id;
      state.showNewChatPrompt = false;
      console.log('Chats after createNewChat:', state.chats);
      console.log('Current chat ID after createNewChat:', state.currentChatId);
    },
    
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(c => c._id === chatId || c.id === chatId);
      
      if (chat) {
        if (!chat.messages) {
          chat.messages = [];
        }
        // Check if message already exists to prevent duplicates
        const messageExists = chat.messages.some(m => m.id === message.id);
        if (!messageExists) {
          chat.messages.push(message);
          // Update title if it's the first message
          if (chat.messages.length === 1) {
            chat.title = message.content.substring(0, 50) + '...';
          }
        }
      }
    },
    
    selectChat: (state, action) => {
      console.log('selectChat called with:', action.payload);
      state.currentChatId = action.payload;
      console.log('Current chat ID after selectChat:', state.currentChatId);
    },
    
    deleteChat: (state, action) => {
      const chatId = action.payload;
      // Remove the chat from the chats array
      state.chats = state.chats.filter(chat => (chat._id !== chatId && chat.id !== chatId));
      
      // If the deleted chat was the current chat, clear the current chat
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
    
    clearCurrentChat: (state) => {
      state.currentChatId = null;
    },
    
    setShowNewChatPrompt: (state, action) => {
      state.showNewChatPrompt = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    setChats: (state, action) => {
      console.log('setChats called with:', action.payload);
      state.chats = action.payload;
      console.log('Chats after setChats:', state.chats);
    },
    
    clearMessages: (state, action) => {
      const chatId = action.payload;
      const chat = state.chats.find(c => c._id === chatId || c.id === chatId);
      if (chat) {
        chat.messages = [];
      }
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        // The message will be added via the addMessage reducer
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const {
  createNewChat,
  addMessage,
  selectChat,
  deleteChat,
  clearCurrentChat,
  setShowNewChatPrompt,
  clearError,
  setChats,
  clearMessages
} = chatSlice.actions;

// Selectors
export const selectAllChats = (state) => state.chat.chats;
export const selectCurrentChatId = (state) => state.chat.currentChatId;

export const selectCurrentChat = createSelector(
  [selectAllChats, selectCurrentChatId],
  (chats, currentChatId) => {
    return chats.find(chat => (chat._id === currentChatId || chat.id === currentChatId)) || null;
  }
);

export const selectCurrentMessages = createSelector(
  [selectCurrentChat],
  (currentChat) => {
    return currentChat ? (currentChat.messages || []) : [];
  }
);

export const selectShowNewChatPrompt = (state) => state.chat.showNewChatPrompt;
export const selectLoading = (state) => state.chat.loading;
export const selectError = (state) => state.chat.error;

export default chatSlice.reducer;
