import { BrowserRouter , Routes , Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

const Approutes = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path = '/' element={<Navigate to="/home" replace />}/>
    <Route path = '/register' element={<Register />}/>
    <Route path = '/login' element={<Login />}/>
    <Route path = '/home' element={<Home />}/>
   </Routes>
   </BrowserRouter>
  )
}

export default Approutes
