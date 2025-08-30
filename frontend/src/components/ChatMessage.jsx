import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        <div className="message-timestamp">
          {message.timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
