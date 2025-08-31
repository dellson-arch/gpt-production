import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([
    { 
      id: 1, 
      title: 'Explain quantum computing', 
      timestamp: '2024-01-15',
      messages: [
        {
          id: 1,
          content: 'Can you explain quantum computing?',
          sender: 'user',
          timestamp: '2024-01-15T10:00:00'
        },
        {
          id: 2,
          content: 'Quantum computing is a type of computation that harnesses the collective properties of quantum states to perform calculations.',
          sender: 'ai',
          timestamp: '2024-01-15T10:01:00'
        }
      ]
    },
    { 
      id: 2, 
      title: 'Creative birthday ideas', 
      timestamp: '2024-01-14',
      messages: [
        {
          id: 3,
          content: 'I need creative birthday ideas for a 10 year old',
          sender: 'user',
          timestamp: '2024-01-14T15:30:00'
        },
        {
          id: 4,
          content: 'Here are some creative birthday ideas for a 10-year-old: 1. Scavenger hunt adventure 2. Science experiment party 3. Art workshop 4. Outdoor movie night',
          sender: 'ai',
          timestamp: '2024-01-14T15:31:00'
        }
      ]
    },
    { 
      id: 3, 
      title: 'JavaScript HTTP requests', 
      timestamp: '2024-01-13',
      messages: [
        {
          id: 5,
          content: 'How do I make an HTTP request in JavaScript?',
          sender: 'user',
          timestamp: '2024-01-13T09:15:00'
        },
        {
          id: 6,
          content: 'You can make HTTP requests in JavaScript using fetch API, XMLHttpRequest, or libraries like axios. Here\'s an example with fetch: fetch(\'https://api.example.com/data\').then(response => response.json()).then(data => console.log(data));',
          sender: 'ai',
          timestamp: '2024-01-13T09:16:00'
        }
      ]
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showNewChatPrompt, setShowNewChatPrompt] = useState(false);

  const getCurrentChat = useCallback(() => {
    return chats.find(chat => chat.id === currentChatId) || null;
  }, [chats, currentChatId]);

  const getCurrentMessages = useCallback(() => {
    const currentChat = getCurrentChat();
    return currentChat ? currentChat.messages : [];
  }, [getCurrentChat]);

  const createNewChat = useCallback((prompt = '') => {
    const newChat = {
      id: Date.now(),
      title: prompt || 'New Chat',
      timestamp: new Date().toISOString().split('T')[0],
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setShowNewChatPrompt(false);
    
    return newChat;
  }, []);

  const addMessageToCurrentChat = useCallback((message) => {
    if (!currentChatId) return;
    
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          title: chat.messages.length === 0 ? message.content.substring(0, 50) + '...' : chat.title
        };
      }
      return chat;
    }));
  }, [currentChatId]);

  const selectChat = useCallback((chatId) => {
    setCurrentChatId(chatId);
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  }, [currentChatId]);

  const clearCurrentChat = useCallback(() => {
    setCurrentChatId(null);
  }, []);

  const value = {
    chats,
    currentChatId,
    currentChat: getCurrentChat(),
    currentMessages: getCurrentMessages(),
    showNewChatPrompt,
    setShowNewChatPrompt,
    createNewChat,
    addMessageToCurrentChat,
    selectChat,
    deleteChat,
    clearCurrentChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
