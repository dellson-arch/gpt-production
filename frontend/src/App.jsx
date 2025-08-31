import Approutes from './Approutes'
import { ThemeProvider } from './context/ThemeContext'
import { ChatProvider } from './context/ChatContext'

const App = () => {
  return (
    <ThemeProvider>
      <ChatProvider>
        <Approutes/>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default App
