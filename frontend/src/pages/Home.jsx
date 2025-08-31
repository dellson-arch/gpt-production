import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import NewChatPrompt from '../components/NewChatPrompt';
import '../styles/chat.css';

const Home = () => {
  const { theme } = useTheme();
  const {
    chats,
    currentChatId,
    currentMessages,
    showNewChatPrompt,
    setShowNewChatPrompt,
    createNewChat,
    addMessageToCurrentChat,
    selectChat
  } = useChat();
  
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // If no current chat, create one
    if (!currentChatId) {
      createNewChat('');
      // Wait for the chat to be created
      setTimeout(() => {
        sendMessageToChat(message);
      }, 0);
      return;
    }

    sendMessageToChat(message);
  };

  const sendMessageToChat = async (message) => {
    const userMessage = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    addMessageToCurrentChat(userMessage);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        content: `This is a simulated AI response to: "${message}". In a real application, this would be connected to your AI service.`,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      addMessageToCurrentChat(aiMessage);
      setIsLoading(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setShowNewChatPrompt(true);
  };

  const handleCreateNewChat = (prompt) => {
    if (prompt) {
      // If prompt is provided, create chat and send the prompt as first message
      createNewChat(prompt);
      setTimeout(() => {
        sendMessageToChat(prompt);
      }, 0);
    } else {
      // Create empty chat
      createNewChat('');
    }
    setIsSidebarOpen(false);
  };

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    setIsSidebarOpen(false);
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
            {isLoading && (
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
          disabled={isLoading}
        />
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* New Chat Prompt Modal */}
      <NewChatPrompt
        isOpen={showNewChatPrompt}
        onClose={() => setShowNewChatPrompt(false)}
        onCreateChat={handleCreateNewChat}
      />
    </div>
  );
};

export default Home;
