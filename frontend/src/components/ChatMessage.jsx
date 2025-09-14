import React from 'react';

const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isError = message.isError || false;
  
  // Function to format message content (detect code blocks, links, etc.)
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    // Split content into lines to detect code blocks
    const lines = content.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Detect code blocks (lines starting with 4 spaces or wrapped in backticks)
      if (line.startsWith('    ') || line.startsWith('```')) {
        return <div key={index} className="code-line">{line}</div>;
      }
      
      // Detect inline code (wrapped in single backticks)
      if (line.includes('`') && line.split('`').length > 2) {
        const parts = line.split('`');
        return (
          <div key={index}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 0 ? part : <code key={partIndex} className="inline-code">{part}</code>
            )}
          </div>
        );
      }
      
      return <div key={index}>{line}</div>;
    });
    
    return formattedLines;
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error){
      console.log(error)
      return timestamp;
    }
  };
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'} ${isError ? 'error-message' : ''}`}>
      <div className="message-avatar">
        {isUser ? '👤' : isError ? '⚠️' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-text">
          {formatMessageContent(message.content)}
        </div>
        <div className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
