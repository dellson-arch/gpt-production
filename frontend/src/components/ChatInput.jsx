import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ value, onChange, onSend, disabled, placeholder = "Ask anything" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isSendDisabled = !value.trim() || disabled;

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
          {/* Plus button on the left */}
          <button
            type="button"
            className="plus-button"
            aria-label="Add attachment"
            title="Add attachment"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          <div className="input-content">
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={value}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              aria-label="Chat message input"
            />
          </div>

          <div className="input-actions">
            {/* Voice input button */}
            <button
              type="button"
              className="voice-button"
              aria-label="Voice input"
              title="Voice input"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>

            {/* Sound wave button */}
            <button
              type="button"
              className="send-button"
              aria-label="Sound wave"
              title="Sound wave"
              disabled={isSendDisabled}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="8" y2="18"></line>
                <line x1="12" y1="4" x2="12" y2="20"></line>
                <line x1="16" y1="8" x2="16" y2="16"></line>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
