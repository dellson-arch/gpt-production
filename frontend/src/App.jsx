import Approutes from './Approutes'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <Approutes/>
    </ThemeProvider>
  )
}

export default App
