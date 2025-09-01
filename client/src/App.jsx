
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Register from "./pages/Register"
import EmailPage from "./pages/EmailPage"
import { Toaster, toast } from 'sonner';

const App = () => {
  return (
      <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/email" element={<EmailPage />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App