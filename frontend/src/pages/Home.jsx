import React, { useState, useRef, useEffect } from 'react';
import {io} from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  selectAllChats, 
  selectCurrentChatId, 
  selectCurrentMessages, 
  selectShowNewChatPrompt,
  selectLoading,
  createNewChat,
  addMessage,
  selectChat,
  setShowNewChatPrompt,
  setChats,
  clearMessages,
  deleteChat
} from '../store/slices/chatSlice';
import { selectTheme } from '../store/slices/themeSlice';

import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import NewChatPrompt from '../components/NewChatPrompt';
import '../styles/chat.css';
import axios from 'axios';

const Home = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const chats = useAppSelector(selectAllChats);
  const currentChatId = useAppSelector(selectCurrentChatId);
  const currentMessages = useAppSelector(selectCurrentMessages);
  const showNewChatPrompt = useAppSelector(selectShowNewChatPrompt);
  const isLoading = useAppSelector(selectLoading);
  
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [socketStatus, setSocketStatus] = useState('connecting');
  const messagesContainerRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection with better error handling
  useEffect(() => {
    const initializeSocket = async () => {
      if (!socket) {
        console.log('Initializing socket connection to http://localhost:3000');
        
        // First check if backend is accessible
        try {
          const response = await fetch('http://localhost:3000/api/chat/', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (response.ok) {
            console.log('Backend is accessible, proceeding with socket connection');
          } else {
            console.log('Backend responded but with status:', response.status);
          }
        } catch (error) {
          console.log('Backend health check failed:', error.message);
        }
        
        const tempSocket = io('http://localhost:3000', {
          withCredentials: true,
          timeout: 20000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          transports: ['websocket', 'polling'], // Try WebSocket first, then polling
        });
        
        tempSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setSocketStatus('connected');
        });
        
        tempSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setSocketStatus('disconnected');
          setLocalLoading(false);
        });
        
        tempSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setSocketStatus('error');
          setLocalLoading(false);
          
          if (error.message.includes('Authentication Error')) {
            console.log('User not authenticated. Please log in first.');
            window.location.href = '/login';
          }
        });
        
        tempSocket.on('reconnect', (attemptNumber) => {
          console.log('Socket reconnected after', attemptNumber, 'attempts');
          setSocketStatus('connected');
        });
        
        tempSocket.on('reconnect_error', (error) => {
          console.error('Socket reconnection error:', error);
          setSocketStatus('error');
        });
        
        tempSocket.on('reconnect_failed', () => {
          console.error('Socket reconnection failed after all attempts');
          setSocketStatus('error');
          setLocalLoading(false);
          
          // Show reconnection failed message
          if (localLoading) {
            const errorMessage = {
              id: Date.now() + 1,
              content: "Connection to the AI service failed. Please refresh the page and try again.",
              sender: 'ai',
              timestamp: new Date().toISOString()
            };
            dispatch(addMessage({ chatId: currentChatId, message: errorMessage }));
          }
        });
        
        tempSocket.on('ai-response', (message) => {
          console.log("Received AI response:", message);
          
          if (message && message.content && message.chat) {
            // Create AI message object
            const aiMessage = {
              id: Date.now() + Math.random(), // Ensure unique ID
              content: message.content,
              sender: 'ai',
              timestamp: new Date().toISOString(),
              isError: message.error || false
            };
            
            // Add AI message to the chat
            dispatch(addMessage({ chatId: message.chat, message: aiMessage }));
            setLocalLoading(false);
            
            // Scroll to bottom to show new message
            setTimeout(() => {
              scrollToBottom();
            }, 100);
          } else {
            console.error('Invalid AI response format:', message);
            setLocalLoading(false);
          }
        });
        
        setSocket(tempSocket);
      }
    };

    initializeSocket();
    
    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket, dispatch]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    console.log('handleSendMessage called with message:', message);
    console.log('Current chat ID:', currentChatId);
    console.log('Current chats:', chats);

    // Check if user is authenticated
    if (!socket || !socket.connected) {
      console.log('User not authenticated or socket not connected. Redirecting to login...');
      window.location.href = '/login';
      return;
    }

    // Check if there are any chats in the store that might be the current one
    if (!currentChatId && chats.length > 0) {
      console.log('No current chat ID but chats exist, using the first chat');
      const firstChat = chats[0];
      dispatch(selectChat(firstChat._id || firstChat.id));
      await sendMessageToChat(message, firstChat._id || firstChat.id);
      return;
    }

    // If no current chat, create one first
    if (!currentChatId) {
      console.log('No current chat ID, creating new chat...');
      try {
        // Create a new chat through the backend API
        const response = await axios.post('http://localhost:3000/api/chat/', {
          title: message.substring(0, 50) + '...'
        }, {
          withCredentials: true
        });
        
        console.log('Backend response for new chat:', response.data);
        
        const newChat = {
          _id: response.data.chat.id,
          title: response.data.chat.title,
          timestamp: new Date().toISOString().split('T')[0],
          messages: []
        };
        
        console.log('New chat object created:', newChat);
        
        // Add the chat to the store and select it
        dispatch(setChats([newChat, ...chats]));
        dispatch(selectChat(response.data.chat.id));
        
        console.log('Chat added to store and selected');
        
        // Use the chat ID directly instead of relying on currentChatId state
        const chatIdToUse = response.data.chat.id;
        console.log('Using chat ID directly:', chatIdToUse);
        
        // Wait a bit for the state to update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Now send the message with the new chat ID
        await sendMessageToChat(message, chatIdToUse);
        return;
      } catch (error) {
        console.error('Error creating chat:', error);
        // Fallback to local chat creation
        const newChatId = Date.now().toString();
        const newChat = {
          _id: newChatId,
          title: message.substring(0, 50) + '...',
          timestamp: new Date().toISOString().split('T')[0],
          messages: []
        };
        
        dispatch(setChats([newChat, ...chats]));
        dispatch(selectChat(newChatId));
        
        console.log('Fallback: Using local chat ID:', newChatId);
        await sendMessageToChat(message, newChatId);
        return;
      }
    } else {
      console.log('Current chat ID exists:', currentChatId);
    }

    // Send message to existing chat
    await sendMessageToChat(message, currentChatId);
  };

  const sendMessageToChat = async (message, chatId) => {
    console.log('sendMessageToChat called with message:', message, 'chatId:', chatId);
    
    if (!chatId) {
      console.error('No chat ID provided');
      return;
    }

    const userMessage = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    console.log('User message created:', userMessage);
    console.log('Adding message to chat:', chatId);

    dispatch(addMessage({ chatId: chatId, message: userMessage }));
    setInputValue('');
    setLocalLoading(true);

    // Send message through socket to get real AI response
    console.log('Sending message through socket to get AI response');
    
    if (socket && socket.connected) {
      socket.emit('ai-message', {
        message: message,
        chat: chatId
      });
    } else {
      console.error('Socket not connected, cannot send message');
      setLocalLoading(false);
      
      // Show error message
      const errorMessage = {
        id: Date.now() + 1,
        content: "Connection error: Cannot connect to AI service. Please refresh the page and try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      dispatch(addMessage({ chatId: chatId, message: errorMessage }));
    }
  };

  const handleNewChat = async() => {
    console.log('handleNewChat called');
    try {
      const response = await axios.post('http://localhost:3000/api/chat/', {
        title: "New Chat"
      }, {
        withCredentials: true
      });
      
      console.log('New chat created:', { message: response.data.message, chats: Array(chats.length + 1) });
      console.log('Response data:', response.data);
      
      // Update the chats list with the new chat from backend and reverse to show newest first
      const updatedChats = [...chats, response.data.chat].reverse();
      dispatch(setChats(updatedChats));
      
      // Select the new chat - use the correct ID field
      const chatId = response.data.chat.id || response.data.chat._id;
      console.log('Selected chat ID:', chatId);
      dispatch(selectChat(chatId));
      
      // Wait a bit for the state to update
      setTimeout(() => {
        console.log('State should be updated now');
      }, 100);
      
    } catch (error) {
      console.error('Error creating new chat:', error);
      // Fallback to local chat creation
      dispatch(createNewChat(''));
    }
  };

  // Load chats from backend when component mounts
  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/chat/', {
          withCredentials: true
        });
        console.log('Loaded chats from backend:', response.data);
        
        // Format chats for frontend
        const formattedChats = response.data.chats.map(chat => ({
          _id: chat.id,
          title: chat.title,
          timestamp: chat.lastActivity ? new Date(chat.lastActivity).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          messages: []
        }));
        
        dispatch(setChats(formattedChats));
      } catch (error) {
        console.error('Error loading chats:', error);
        // Don't show error to user, just log it
      }
    };

    // Only load chats if socket is connected (user is authenticated)
    if (socketStatus === 'connected') {
      loadChats();
    }
  }, [dispatch, socketStatus]);

  const handleCreateNewChat = async (prompt) => {
    if (prompt) {
      try {
        // Create a new chat through the backend API
        const response = await axios.post('http://localhost:3000/api/chat/', {
          title: prompt.substring(0, 50) + '...'
        }, {
          withCredentials: true
        });
        
        const newChat = {
          _id: response.data.chat.id,
          title: response.data.chat.title,
          timestamp: new Date().toISOString().split('T')[0],
          messages: []
        };
        
        // Add the chat to the store and select it
        dispatch(setChats([newChat, ...chats]));
        dispatch(selectChat(response.data.chat.id));
        
        // Use the chat ID directly
        const chatIdToUse = response.data.chat.id;
        console.log('handleCreateNewChat: Using chat ID directly:', chatIdToUse);
        
        // Send the prompt as the first message
        await sendMessageToChat(prompt, chatIdToUse);
      } catch (error) {
        console.error('Error creating chat:', error);
        // Fallback to local chat creation
        dispatch(createNewChat(prompt));
        const newChatId = Date.now().toString();
        setTimeout(() => {
          sendMessageToChat(prompt, newChatId);
        }, 100);
      }
    } else {
      // Create empty chat
      dispatch(createNewChat(''));
    }
    setIsSidebarOpen(false);
  };

  const handleChatSelect = async (chatId) => {
    dispatch(selectChat(chatId));
    setIsSidebarOpen(false);
    
    // Clear any existing messages for this chat first
    dispatch(clearMessages(chatId));
    
    // Load messages for the selected chat
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/${chatId}/messages`, {
        withCredentials: true
      });
      
      console.log('Loaded messages for chat:', chatId, response.data);
      
      // Convert backend messages to frontend format and add them to the chat
      const messages = response.data.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai',
        timestamp: msg.timestamp
      }));
      
      // Add messages to the current chat
      messages.forEach(message => {
        dispatch(addMessage({ chatId, message }));
      });
      
    } catch (error) {
      console.error('Error loading messages:', error);
      // Show error message to user
      const errorMessage = {
        id: Date.now(),
        content: "Error loading chat history. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      dispatch(addMessage({ chatId, message: errorMessage }));
    }
  };

  const handleDeleteChat = async (chatId) => {
    console.log('handleDeleteChat called for chatId:', chatId);
    try {
      const response = await axios.delete(`http://localhost:3000/api/chat/${chatId}`, {
        withCredentials: true
      });
      console.log('Chat deleted from backend:', response.data);
      dispatch(deleteChat(chatId));
      if (currentChatId === chatId) {
        dispatch(selectChat(null)); // Clear current chat if the deleted one was active
      }
    } catch (error) {
      console.error('Error deleting chat from backend:', error);
      // Optionally show an error message to the user
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="chat-container" data-theme={theme}>
      {/* Mobile Header */}
      <header className="chat-header-mobile">
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="chat-title">ChatGPT</h1>
        
                 {/* Connection Status Indicator */}
         <div className="connection-status-mobile">
           <div className={`status-indicator ${socketStatus}`}>
             <span className="status-dot"></span>
             {socketStatus === 'error' && (
               <button 
                 className="reconnect-btn"
                 onClick={() => {
                   if (socket) {
                     socket.disconnect();
                     setSocket(null);
                     setSocketStatus('connecting');
                   }
                 }}
                 title="Reconnect"
               >
                 ↻
               </button>
             )}
           </div>
         </div>
        
        <button 
          className="new-chat-btn-mobile"
          onClick={handleNewChat}
          aria-label="New chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </header>

      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        previousChats={chats}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        currentChatId={currentChatId}
      />

      {/* Main Chat Area */}
      <main className="chat-main">
        {currentMessages.length === 0 ? (
          <div className="welcome-screen">
            <h1 className="welcome-title">ChatGPT</h1>
            <div className="welcome-grid">
              <div className="welcome-column">
                <div className="welcome-icon">💡</div>
                <h3>Examples</h3>
                <ul>
                  <li>"Explain quantum computing in simple terms"</li>
                  <li>"Got any creative ideas for a 10 year old's birthday?"</li>
                  <li>"How do I make an HTTP request in Javascript?"</li>
                </ul>
              </div>
              <div className="welcome-column">
                <div className="welcome-icon">⚡</div>
                <h3>Capabilities</h3>
                <ul>
                  <li>Remembers what user said earlier in the conversation</li>
                  <li>Allows user to provide follow-up corrections</li>
                  <li>Trained to decline inappropriate requests</li>
                </ul>
              </div>
              <div className="welcome-column">
                <div className="welcome-icon">⚠️</div>
                <h3>Limitations</h3>
                <ul>
                  <li>May occasionally generate incorrect information</li>
                  <li>May occasionally produce harmful instructions or biased content</li>
                  <li>Limited knowledge of world and events after 2021</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="messages-container" ref={messagesContainerRef}>
            {currentMessages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {(isLoading || localLoading) && (
              <div className="message ai-message">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Input */}
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isLoading || localLoading}
        />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* New Chat Prompt Modal */}
      <NewChatPrompt
        isOpen={showNewChatPrompt}
        onClose={() => dispatch(setShowNewChatPrompt(false))}
        onCreateChat={handleCreateNewChat}
      />
    </div>
  );
};

export default Home;
