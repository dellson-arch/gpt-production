# GPT Production Frontend

A modern, responsive chat interface built with React and Vite, featuring a ChatGPT-like design with mobile-first approach.

## Features

- **ChatGPT-like Interface**: Clean, modern design similar to ChatGPT's web interface
- **Mobile-First Design**: Responsive design that works perfectly on all devices
- **Dark/Light Theme**: Automatic theme switching with manual toggle option
- **Real-time Chat**: Interactive chat interface with message history
- **Responsive Sidebar**: Collapsible sidebar for previous chats (desktop) and mobile overlay
- **Modern UI Components**: Built with CSS custom properties and modern CSS features

## Components

### Home.jsx
Main chat interface component that includes:
- Welcome screen with examples, capabilities, and limitations
- Chat message display
- Message input with send functionality
- Responsive sidebar integration

### ChatSidebar.jsx
Sidebar component for navigation and chat history:
- New chat button
- Previous chat list
- Theme toggle
- Settings and logout options
- Mobile overlay support

### ChatMessage.jsx
Individual message display component:
- User and AI message styling
- Timestamp display
- Avatar icons

### ChatInput.jsx
Message input component:
- Textarea with auto-resize
- Send button
- Enter key support
- Loading state handling

## Styling

### theme.css
Comprehensive CSS custom properties for:
- Color schemes (dark/light themes)
- Spacing and typography
- Shadows and borders
- Transitions and animations

### chat.css
Mobile-first responsive styles for:
- Chat container layout
- Sidebar behavior
- Message styling
- Input field design
- Responsive breakpoints

## Responsive Breakpoints

- **Mobile**: < 768px - Single column layout, mobile header, overlay sidebar
- **Tablet**: 768px - 1023px - Two-column layout, desktop sidebar
- **Desktop**: 1024px+ - Full layout with wider sidebar and enhanced spacing

## Usage

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the home page** (`/home`) to access the chat interface

3. **Use the sidebar** to:
   - Start new chats
   - View previous chat history
   - Toggle between dark/light themes
   - Access settings and logout

4. **Chat functionality**:
   - Type messages in the input field
   - Press Enter or click send to submit
   - View AI responses (currently simulated)
   - Scroll through message history

## State Management

The chat interface uses React hooks for state management:
- `messages`: Array of chat messages
- `inputValue`: Current input field value
- `previousChats`: List of previous chat sessions
- `isSidebarOpen`: Mobile sidebar visibility state
- `isLoading`: AI response loading state

## Theme System

- **Automatic**: Detects system preference
- **Manual**: Use theme toggle in sidebar
- **Persistent**: Saves preference to localStorage
- **CSS Variables**: All styling uses CSS custom properties

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Mobile browsers with touch support
- Progressive enhancement for older browsers

## Development

- Built with React 19 and Vite
- Uses modern ES6+ features
- CSS custom properties for theming
- Mobile-first responsive design
- Accessibility features included

## Future Enhancements

- Real AI integration
- Chat persistence
- User authentication
- File upload support
- Voice input/output
- Multi-language support
