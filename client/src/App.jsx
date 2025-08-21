import {BrowserRouter, Routes, Route} from "react-router-dom"
import Register from "./pages/Register"
import EmailPage from "./pages/EmailPage"

const App = () => {
  return (
      <BrowserRouter>
      <Routes>
        <Route path="/email" element={<EmailPage />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App