import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const NewChatPrompt = ({ isOpen, onClose, onCreateChat }) => {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onCreateChat(prompt.trim());
      setPrompt('');
    }
  };

  const handleCancel = () => {
    setPrompt('');
    onClose();
  };

  const handleCreateWithoutPrompt = () => {
    onCreateChat('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" data-theme={theme} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Start a New Chat</h2>
          <button className="modal-close" onClick={handleCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="prompt">What would you like to chat about?</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Explain quantum computing, Help me plan a vacation, Write a poem about nature..."
              rows="4"
              autoFocus
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" className="btn-secondary" onClick={handleCreateWithoutPrompt}>
              Start Empty Chat
            </button>
            <button type="submit" className="btn-primary" disabled={!prompt.trim()}>
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChatPrompt;
