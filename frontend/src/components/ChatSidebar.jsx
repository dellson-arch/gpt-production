import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectTheme } from '../store/slices/themeSlice';
import { toggleTheme } from '../store/slices/themeSlice';
import '../styles/chat.css';

const ChatSidebar = ({ isOpen, onClose, previousChats, onNewChat, onChatSelect, onDeleteChat, currentChatId }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="chat-sidebar desktop">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New chat
          </button>
        </div>

        <div className="sidebar-content">
          <div className="chat-history">
            <h3 className="history-title">Previous chats</h3>
            {previousChats.length > 0 ? (
              <div className="chat-list">
                {previousChats.map((chat, index) => (
                  <div
                    key={chat._id || chat.id || `chat-${index}`}
                    className={`chat-item-container ${currentChatId === (chat._id || chat.id) ? 'active' : ''}`}
                  >
                    <button
                      className={`chat-item ${currentChatId === (chat._id || chat.id) ? 'active' : ''}`}
                      onClick={() => onChatSelect(chat._id || chat.id)}
                    >
                      <span className="chat-title">{chat.title}</span>
                      <span className="chat-timestamp">{chat.timestamp}</span>
                    </button>
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id || chat.id);
                      }}
                      title="Delete chat"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-chats">No previous chats</p>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-btn" onClick={handleToggleTheme}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {theme === 'dark' ? (
                <circle cx="12" cy="12" r="5"></circle>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              )}
            </svg>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            Updates & FAQ
          </button>
          
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`chat-sidebar mobile ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New chat
          </button>
          <button className="close-sidebar" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="chat-history">
            <h3 className="history-title">Previous chats</h3>
            {previousChats.length > 0 ? (
              <div className="chat-list">
                {previousChats.map((chat, index) => (
                  <div
                    key={chat._id || chat.id || `chat-${index}`}
                    className={`chat-item-container ${currentChatId === (chat._id || chat.id) ? 'active' : ''}`}
                  >
                    <button
                      className={`chat-item ${currentChatId === (chat._id || chat.id) ? 'active' : ''}`}
                      onClick={() => onChatSelect(chat._id || chat.id)}
                    >
                      <span className="chat-title">{chat.title}</span>
                      <span className="chat-timestamp">{chat.timestamp}</span>
                    </button>
                    <button
                      className="delete-chat-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id || chat.id);
                      }}
                      title="Delete chat"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-chats">No previous chats</p>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-btn" onClick={handleToggleTheme}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {theme === 'dark' ? (
                <circle cx="12" cy="12" r="5"></circle>
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              )}
            </svg>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            Updates & FAQ
          </button>
          
          <button className="sidebar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
